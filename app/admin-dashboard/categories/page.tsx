"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Filter, Eye, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { useSidebar } from "../../../hooks/useSidebar";
import { Categorie } from "../../../models/Categorie";
import { useCategoriesApi } from "../../../hooks/useCategoriesApi";
import { Button, Input } from "../../../components/ui";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

// --- AddCategoryModal ---
import { X, Tag } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (category: { name: string; description: string }) => void;
}

function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la catégorie est requis";
    }

    if (formData.name.length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      onSuccess?.(categoryData);

      // Reset form
      setFormData({
        name: "",
        description: "",
      });
      setErrors({});

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Tag size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Ajouter une catégorie
              </h2>
              <p className="text-zinc-600">
                Créez une nouvelle catégorie de produits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom de la catégorie */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Nom de la catégorie <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Électronique, Vêtements..."
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description <span className="text-zinc-400">(optionnel)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all resize-none text-black"
              placeholder="Description de la catégorie..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter la catégorie"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- EditCategoryModal ---
import { Edit3 } from "lucide-react";

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Categorie | null;
  onClose: () => void;
  onSave: (data: {
    nom: string;
    description: string;
    is_active: boolean;
  }) => void;
}

function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSave,
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState<{
    nom: string;
    description: string;
    is_active: boolean;
  }>({
    nom: category?.nom || "",
    description: category?.description || "",
    is_active: category?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Met à jour le formData si la catégorie change (édition d'une nouvelle catégorie)
  // Sinon, le formulaire resterait sur l'ancienne valeur
  useEffect(() => {
    setFormData({
      nom: category?.nom || "",
      description: category?.description || "",
      is_active: category?.is_active ?? true,
    });
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la catégorie est requis";
    }

    if (formData.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      onSave({
        nom: formData.nom.trim(),
        description: formData.description.trim(),
        is_active: formData.is_active,
      });
      onClose();
    } catch (error) {
      // Gérer l'erreur si besoin
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Edit3 size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Modifier la catégorie
              </h2>
              <p className="text-zinc-600">
                Modifiez les informations de la catégorie
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom de la catégorie */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Nom de la catégorie *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleInputChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-zinc-900 ${
                errors.nom
                  ? "border-red-300 focus:ring-red-200"
                  : "border-zinc-300 focus:ring-blue-200 focus:border-blue-400"
              }`}
              placeholder="Ex: Électronique, Vêtements..."
              required
            />
            {errors.nom && (
              <p className="text-red-600 text-sm mt-1">{errors.nom}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description <span className="text-zinc-400">(optionnel)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none text-black"
              placeholder="Description de la catégorie..."
            />
          </div>

          {/* Toggle Catégorie active */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Catégorie active
            </label>
            <div className="flex items-center gap-3">
              <span
                className={`relative inline-block w-11 h-6 transition duration-200 align-middle select-none`}
              >
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    handleInputChange("is_active", e.target.checked)
                  }
                  className="sr-only"
                />
                <span
                  className={`block w-11 h-6 rounded-full transition-colors duration-200 ${
                    formData.is_active ? "bg-blue-600" : "bg-zinc-300"
                  }`}
                ></span>
                <span
                  className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    formData.is_active ? "translate-x-5" : ""
                  }`}
                ></span>
              </span>
              <span className="text-sm text-zinc-700">
                {formData.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? "Modification..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CategoryPreviewModal ---
import { Calendar, User as UserIcon } from "lucide-react";

interface CategoryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Categorie | null;
  onEdit: (category: Categorie) => void;
}

function CategoryPreviewModal({
  isOpen,
  onClose,
  category,
  onEdit,
}: CategoryPreviewModalProps) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Eye size={28} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Aperçu de la catégorie
              </h2>
              <p className="text-zinc-600 text-sm">{category.nom}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Nom
            </div>
            <div className="text-zinc-900 font-medium">{category.nom}</div>
          </div>
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Description
            </div>
            <div className="text-zinc-700">
              {category.description || (
                <span className="italic text-zinc-400">Aucune description</span>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Statut
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                category.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {category.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Informations de création */}
          <div className="bg-zinc-50 rounded-lg p-4">
            <div className="mb-3 text-xs text-zinc-500 font-semibold uppercase flex items-center gap-1">
              <UserIcon size={12} />
              Informations de création
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Créé par :</span>
                <span className="text-zinc-900 font-medium">
                  {category.created_by_username ||
                    category.created_by ||
                    "Inconnu"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Type :</span>
                <span className="text-zinc-700 capitalize">
                  {category.created_by_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date :</span>
                <span className="text-zinc-700 flex items-center gap-1">
                  <Calendar size={12} />
                  {category.created_at.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Informations de modification */}
          {category.updated_at && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="mb-3 text-xs text-zinc-500 font-semibold uppercase flex items-center gap-1">
                <Edit size={12} />
                Dernière modification
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Modifié par :</span>
                  <span className="text-zinc-900 font-medium">
                    {category.updated_by_username ||
                      category.updated_by ||
                      "Inconnu"}
                  </span>
                </div>
                {category.updated_by_type && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Type :</span>
                    <span className="text-zinc-700 capitalize">
                      {category.updated_by_type}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date :</span>
                  <span className="text-zinc-700 flex items-center gap-1">
                    <Calendar size={12} />
                    {category.updated_at.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-700 font-medium hover:bg-zinc-300 transition"
          >
            Fermer
          </button>
          <button
            onClick={() => onEdit(category)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Edit size={16} /> Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function CategoriesPage() {
  useAdminRequireAuth();
  const { isOpen } = useSidebar();
  const [token] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || ""
      : "",
  );
  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategorie,
    updateCategorie,
    deleteCategorie,
  } = useCategoriesApi(token);

  // Charger les catégories au montage du composant
  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(
    null,
  );

  // Aperçu catégorie
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categorie | null>(
    null,
  );

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter(
    (category) =>
      (category.nom &&
        category.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // State pour le sidebar mobile
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const handleOpenSidebar = () => setSidebarMobileOpen(true);
  const handleCloseSidebar = () => setSidebarMobileOpen(false);

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
          <div className="max-w-full md:max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 mb-1">
                Gestion des Catégories
              </h1>
              <p className="text-zinc-500 mb-4 md:mb-6 text-sm md:text-base">
                Gérez vos catégories de produits
              </p>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                  <div>
                    <div className="text-zinc-500 text-xs md:text-sm mb-1">
                      Total Catégories
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-zinc-900">
                      {categories.length}
                    </div>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-blue-100">
                    <Filter className="text-blue-600" size={20} />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                  <div>
                    <div className="text-zinc-500 text-xs md:text-sm mb-1">
                      Catégories Actives
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-zinc-900">
                      {categories.filter((c) => c.is_active).length}
                    </div>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-green-100">
                    <Eye className="text-green-600" size={20} />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                  <div>
                    <div className="text-zinc-500 text-xs md:text-sm mb-1">
                      Types de catégories
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-zinc-900">
                      2
                    </div>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-purple-100">
                    <Filter className="text-purple-600" size={20} />
                  </div>
                </div>
              </div>
              {/* Search & Add Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col md:flex-row md:items-center gap-4 px-4 md:px-6 py-4 mb-4 md:mb-6">
                <div className="flex-1 flex gap-3">
                  <div className="relative w-full md:max-w-xs">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <input
                      type="text"
                      placeholder="Rechercher une catégorie..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-transparent border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all text-sm text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                  {/* Ici tu peux ajouter d'autres filtres si besoin */}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    leftIcon={<Plus size={18} />}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAddCategoryModal(true)}
                  >
                    Ajouter une catégorie
                  </Button>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Catégorie
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">
                        Description
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Statut
                      </th>

                      <th className="px-3 md:px-6 py-2 md:py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredCategories.map((category) => (
                      <tr
                        key={category.categorie_id}
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-3 md:px-6 py-2 md:py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-medium text-zinc-900">
                              {category.nom}
                            </span>
                            <span className="text-zinc-600 text-xs sm:hidden">
                              {category.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 hidden sm:table-cell">
                          <span className="text-zinc-600 text-sm">
                            {category.description}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4">
                          <button
                            type="button"
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              category.is_active
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                            title={`Cliquer pour ${category.is_active ? "désactiver" : "activer"} cette catégorie`}
                            onClick={async () => {
                              const id = category.categorie_id;
                              if (!id || typeof id !== "string") {
                                alert(
                                  "ID catégorie invalide, impossible de modifier le statut.",
                                );
                                return;
                              }
                              await updateCategorie(id, {
                                is_active: !category.is_active,
                              });
                            }}
                          >
                            {category.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Bouton œil pour aperçu */}
                            <button
                              className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Aperçu"
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowPreviewModal(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">
                    Aucune catégorie trouvée
                  </h3>
                  <p className="text-zinc-500">
                    {searchTerm
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commencez par créer votre première catégorie"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSuccess={({ name, description }) => {
          addCategorie({ nom: name, description }).then(() => {
            setShowAddCategoryModal(false);
          });
        }}
      />

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={({ nom, description, is_active }) => {
            updateCategorie(editingCategory.categorie_id, {
              nom,
              description,
              is_active,
            }).then(() => {
              setEditingCategory(null);
            });
          }}
        />
      )}
      {/* Aperçu catégorie */}
      <CategoryPreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onEdit={(cat) => {
          setShowPreviewModal(false);
          setEditingCategory(cat);
        }}
      />
    </div>
  );
}
