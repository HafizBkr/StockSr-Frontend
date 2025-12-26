"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import KPICard from "../../../components/dashboard/kpi-card";
import {
  Package,
  ShieldCheck,
  AlertTriangle,
  Search,
  Plus,
  Eye,
  Edit,
  Menu,
} from "lucide-react";
import { Input, Button } from "../../../components/ui";
import CustomSelect from "../../../components/ui/CustomSelect";
import AddProductModal from "./modals/AddProductModal";
import EditProductModal from "./modals/EditProductModal";
import ProductPreviewModal from "./modals/ProductPreviewModal";
import ClientOnlyDate from "../../../components/ClientOnlyDate";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";
import { useProduitsApi } from "../../../hooks/useProduitsApi";
import { useCategoriesApi } from "../../../hooks/useCategoriesApi";
import { useFournisseursApi } from "../../../hooks/useFournisseursApi";
import type {
  Produit,
  ProduitCreate,
  ProduitUpdate,
} from "../../../models/produit";

// Utilitaire pour formater la monnaie
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductsPage() {
  useAdminRequireAuth();

  // Récupération du token admin (adapter selon ton auth)
  const [token] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || ""
      : "",
  );

  // Hook pour produits
  const {
    produits,
    loading: loadingProduits,
    error: errorProduits,
    fetchProduits,
    createProduit,
    updateProduit,
  } = useProduitsApi(token);

  // Hook pour catégories
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
    fetchCategories,
  } = useCategoriesApi(token);

  // Hook pour fournisseurs
  const {
    fournisseurs,
    loading: loadingFournisseurs,
    error: errorFournisseurs,
    fetchFournisseurs,
    getActiveFournisseurs,
    getFournisseurName,
  } = useFournisseursApi(token);

  // États filtres et modales
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<
    "all" | "sufficient" | "low" | "out"
  >("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null);

  // État pour la sidebar mobile
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const handleOpenSidebar = () => setSidebarMobileOpen(true);
  const handleCloseSidebar = () => setSidebarMobileOpen(false);

  // Fonctions memoized pour éviter les boucles infinies
  const loadProducts = useCallback(() => {
    if (token) {
      fetchProduits();
    }
  }, [token, fetchProduits]);

  const loadCategories = useCallback(() => {
    if (token) {
      fetchCategories();
    }
  }, [token, fetchCategories]);

  const loadFournisseurs = useCallback(() => {
    if (token) {
      fetchFournisseurs();
    }
  }, [token, fetchFournisseurs]);

  // Rafraîchir la liste au chargement
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadFournisseurs();
  }, [loadProducts, loadCategories, loadFournisseurs]);

  // Helper pour récupérer le nom de catégorie
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.categorie_id === categoryId);
    return category?.nom || "Catégorie inconnue";
  };

  // Helper pour les catégories actives
  const getActiveCategories = () => {
    return categories.filter((cat) => cat.is_active);
  };

  // Fonction pour basculer le statut d'un produit
  const toggleProductStatus = async (productId: string) => {
    const product = produits.find((p) => p.produit_id === productId);
    if (!product) return;

    await updateProduit(productId, {
      is_active: !product.is_active,
    });
  };

  // Filtrage des produits
  const filteredProducts = produits.filter((product) => {
    const name = product.nom || "";
    const matchesCategory =
      categoryFilter === "all" || product.categorie_id === categoryFilter;

    let matchesStock = true;
    if (stockFilter === "sufficient") {
      matchesStock = product.quantite_stock > (product.seuil_alerte || 10);
    } else if (stockFilter === "low") {
      matchesStock =
        product.quantite_stock <= (product.seuil_alerte || 10) &&
        product.quantite_stock > 0;
    } else if (stockFilter === "out") {
      matchesStock = product.quantite_stock === 0;
    }

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      product.produit_id.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(product.categorie_id)
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesStock && matchesSearch;
  });

  // Statistiques produits
  const totalProducts = produits.length;
  const activeProducts = produits.filter((p) => p.is_active).length;
  const inactiveProducts = produits.filter((p) => !p.is_active).length;

  const sufficientStock = produits.filter(
    (p) => p.quantite_stock > (p.seuil_alerte || 10),
  ).length;
  const lowStock = produits.filter(
    (p) => p.quantite_stock <= (p.seuil_alerte || 10) && p.quantite_stock > 0,
  ).length;
  const outOfStock = produits.filter((p) => p.quantite_stock === 0).length;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans overflow-x-hidden flex flex-col md:flex-row">
      {/* Bouton hamburger mobile */}
      {!sidebarMobileOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-lg p-3 rounded-full flex items-center justify-center"
          onClick={handleOpenSidebar}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-7 h-7 text-white" />
        </button>
      )}

      <Sidebar />

      {/* Sidebar mobile drawer */}
      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleCloseSidebar}
          />
          <div className="relative z-50 w-64 h-full shadow-xl">
            <MobileSidebar onClose={handleCloseSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="w-full">
            {/* Titre & sous-titre */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 mb-1 md:mb-2">
                Gestion des Produits
              </h1>
              <p className="text-zinc-600 text-sm md:text-base">
                Gérez votre inventaire, vos prix et consultez les stocks.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Products */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium mb-2">
                        Total Produits
                      </h3>
                      <p className="text-4xl font-bold text-gray-900">
                        {totalProducts}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Active Products */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium mb-2">
                        Produits Actifs
                      </h3>
                      <p className="text-4xl font-bold text-gray-900">
                        {activeProducts}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Eye className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium mb-2">
                        Stock Faible
                      </h3>
                      <p className="text-4xl font-bold text-red-500">
                        {lowStock}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres et Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left side - Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm text-gray-700 min-w-[180px]"
                      disabled={loadingCategories}
                    >
                      <option value="all">Toutes les catégories</option>
                      {getActiveCategories().map((cat) => (
                        <option key={cat.categorie_id} value={cat.categorie_id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                    <select
                      value={stockFilter}
                      onChange={(e) =>
                        setStockFilter(
                          e.target.value as
                            | "all"
                            | "sufficient"
                            | "low"
                            | "out",
                        )
                      }
                      className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm text-gray-700 min-w-[160px]"
                    >
                      <option value="all">Tous les stocks</option>
                      <option value="sufficient">Stock suffisant</option>
                      <option value="low">Stock faible</option>
                      <option value="out">Épuisé</option>
                    </select>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Exporter Rapport
                  </button>
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 10v4m6-4v4"
                      />
                    </svg>
                    + Restockage
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm"
                  >
                    <Plus size={20} />
                    Ajouter un produit
                  </button>
                </div>
              </div>
            </div>

            {/* Table responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Produit
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Catégorie
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Prix d'achat
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Prix de vente
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Stock
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Statut
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex flex-col items-center justify-center py-16">
                            <Package size={48} className="text-zinc-200 mb-4" />
                            <div className="text-lg font-medium text-zinc-900 mb-2">
                              Aucun produit trouvé
                            </div>
                            <div className="text-zinc-500">
                              Aucun produit ne correspond à vos critères de
                              recherche.
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.produit_id}
                          className="hover:bg-zinc-50 transition-colors"
                        >
                          <td className="px-4 lg:px-6 py-4 flex items-center gap-3">
                            <Package size={22} className="text-zinc-400" />
                            <span className="font-medium text-zinc-900">
                              {product.nom}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span className="text-zinc-600">
                              {getCategoryName(product.categorie_id)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span className="text-zinc-600">
                              {formatCurrency(product.prix_achat)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span className="font-medium text-zinc-900">
                              {formatCurrency(product.prix_vente)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                product.quantite_stock === 0
                                  ? "bg-red-100 text-red-700"
                                  : product.quantite_stock <=
                                      (product.seuil_alerte || 10)
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.quantite_stock}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <button
                              type="button"
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                product.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                              title={`Cliquer pour ${
                                product.is_active ? "désactiver" : "activer"
                              } ce produit`}
                              onClick={() =>
                                toggleProductStatus(product.produit_id)
                              }
                            >
                              {product.is_active ? "Actif" : "Inactif"}
                            </button>
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-right">
                            <button
                              className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Voir les détails"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowPreviewModal(true);
                              }}
                            >
                              <Eye size={20} />
                            </button>
                            <button
                              className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all ml-2"
                              title="Modifier"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                <div className="p-4 space-y-4">
                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Package size={48} className="text-zinc-200 mb-4" />
                      <div className="text-lg font-medium text-zinc-900 mb-2">
                        Aucun produit trouvé
                      </div>
                      <div className="text-zinc-500 text-center">
                        Aucun produit ne correspond à vos critères de recherche.
                      </div>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.produit_id}
                        className="border border-zinc-200 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-zinc-900">
                              {product.nom}
                            </h3>
                            <p className="text-sm text-zinc-500">
                              {getCategoryName(product.categorie_id)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 text-zinc-400 hover:text-blue-600 rounded-lg"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowPreviewModal(true);
                              }}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="p-2 text-zinc-400 hover:text-green-600 rounded-lg"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-zinc-500">Prix d'achat:</span>
                            <div className="font-medium">
                              {formatCurrency(product.prix_achat)}
                            </div>
                          </div>
                          <div>
                            <span className="text-zinc-500">
                              Prix de vente:
                            </span>
                            <div className="font-medium">
                              {formatCurrency(product.prix_vente)}
                            </div>
                          </div>
                          <div>
                            <span className="text-zinc-500">Stock:</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                product.quantite_stock === 0
                                  ? "bg-red-100 text-red-700"
                                  : product.quantite_stock <=
                                      (product.seuil_alerte || 10)
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.quantite_stock}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Statut:</span>
                            <button
                              className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                product.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                              onClick={() =>
                                toggleProductStatus(product.produit_id)
                              }
                            >
                              {product.is_active ? "Actif" : "Inactif"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSuccess={async (data: ProduitCreate) => {
          await createProduit(data);
          setShowAddModal(false);
        }}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
        onSuccess={async (data: ProduitUpdate) => {
          if (selectedProduct) {
            await updateProduit(selectedProduct.produit_id, data);
            setShowEditModal(false);
            setSelectedProduct(null);
          }
        }}
      />

      <ProductPreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
        onEdit={(product) => {
          setShowPreviewModal(false);
          setShowEditModal(true);
          setSelectedProduct(product);
        }}
      />
    </div>
  );
}
