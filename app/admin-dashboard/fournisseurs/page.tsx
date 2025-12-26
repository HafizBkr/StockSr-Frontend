"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Eye, Menu, Tag } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { Button, Input } from "../../../components/ui";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";
import { useFournisseursApi } from "../../../hooks/useFournisseursApi";
import AddFournisseurModal from "./modals/AddFournisseurModal";
import EditFournisseurModal from "./modals/EditFournisseurModal";
import FournisseurPreviewModal from "./modals/FournisseurPreviewModal";
import type {
  Fournisseur,
  FournisseurCreate,
  FournisseurUpdate,
} from "../../../models/fournisseur";

export default function FournisseursPage() {
  useAdminRequireAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] =
    useState<Fournisseur | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const {
    fournisseurs,
    loading,
    error,
    fetchFournisseurs,
    createFournisseur,
    updateFournisseur,
  } = useFournisseursApi(
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || ""
      : "",
  );

  useEffect(() => {
    fetchFournisseurs();
  }, [fetchFournisseurs]);

  const filteredFournisseurs = fournisseurs.filter((f) => {
    const matchSearch = f.nom.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === "active") {
      return matchSearch && f.is_active;
    }
    if (filterStatus === "inactive") {
      return matchSearch && !f.is_active;
    }
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans overflow-x-hidden flex flex-col md:flex-row">
      {/* Sidebar */}
      {!sidebarMobileOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-lg p-3 rounded-full flex items-center justify-center"
          onClick={() => setSidebarMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-7 h-7 text-white" />
        </button>
      )}
      <Sidebar />
      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <div className="relative z-50 w-64 h-full shadow-xl">
            <MobileSidebar onClose={() => setSidebarMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="w-full">
            {/* Titre & actions */}
            <div className="mb-6 md:mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 mb-1 md:mb-2">
                  Gestion des Fournisseurs
                </h1>
                <p className="text-zinc-600 text-sm md:text-base">
                  Gérez vos fournisseurs et leurs informations de contact.
                </p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Ajouter un fournisseur
              </Button>
            </div>

            {/* KPI Cards dynamiques pour fournisseurs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                <div>
                  <div className="text-zinc-500 text-xs md:text-sm mb-1">
                    Total Fournisseurs
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-zinc-900">
                    {fournisseurs.length}
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                    width={20}
                    height={20}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth={2}
                      d="M3 5h18M6 10h12M10 15h4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                <div>
                  <div className="text-zinc-500 text-xs md:text-sm mb-1">
                    Fournisseurs Actifs
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-zinc-900">
                    {fournisseurs.filter((f) => f.is_active).length}
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600"
                    width={20}
                    height={20}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                <div>
                  <div className="text-zinc-500 text-xs md:text-sm mb-1">
                    Fournisseurs Inactifs
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-zinc-900">
                    {fournisseurs.filter((f) => !f.is_active).length}
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-purple-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-purple-600"
                    width={20}
                    height={20}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth={2}
                      d="M3 5h18M6 10h12M10 15h4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Recherche */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Rechercher un fournisseur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "active" | "inactive",
                  )
                }
                className="py-2 px-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>

            {/* Tableau des fournisseurs */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Téléphone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredFournisseurs.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="flex flex-col items-center justify-center py-16">
                            <span className="text-zinc-200 mb-4">
                              <Tag size={48} />
                            </span>
                            <div className="text-lg font-medium text-zinc-900 mb-2">
                              Aucun fournisseur trouvé
                            </div>
                            <div className="text-zinc-500">
                              Aucun fournisseur ne correspond à vos critères de
                              recherche.
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredFournisseurs.map((fournisseur) => (
                        <tr
                          key={fournisseur.fournisseur_id}
                          className="hover:bg-zinc-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-black">
                            {fournisseur.nom}
                          </td>
                          <td className="px-4 py-4 text-black">
                            {fournisseur.contact || "-"}
                          </td>
                          <td className="px-4 py-4 text-black">
                            {fournisseur.email || "-"}
                          </td>
                          <td className="px-4 py-4 text-black">
                            {fournisseur.telephone || "-"}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              className={`px-2 py-1 rounded-md text-xs font-medium focus:outline-none transition-colors ${
                                fournisseur.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                              title={`Cliquer pour ${fournisseur.is_active ? "désactiver" : "activer"} ce fournisseur`}
                              onClick={async () => {
                                await updateFournisseur(
                                  fournisseur.fournisseur_id,
                                  {
                                    is_active: !fournisseur.is_active,
                                  },
                                );
                                fetchFournisseurs();
                              }}
                            >
                              {fournisseur.is_active ? "Actif" : "Inactif"}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Voir les détails"
                              onClick={() => {
                                setSelectedFournisseur(fournisseur);
                                setShowPreviewModal(true);
                              }}
                            >
                              <Eye size={20} />
                            </button>
                            <button
                              className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all ml-2"
                              title="Modifier"
                              onClick={() => {
                                setSelectedFournisseur(fournisseur);
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
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <AddFournisseurModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={async (data: FournisseurCreate) => {
          await createFournisseur(data);
          setShowAddModal(false);
          fetchFournisseurs();
        }}
      />
      <EditFournisseurModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        fournisseur={selectedFournisseur}
        onSave={async (data: FournisseurUpdate) => {
          if (selectedFournisseur) {
            await updateFournisseur(selectedFournisseur.fournisseur_id, data);
            setShowEditModal(false);
            fetchFournisseurs();
          }
        }}
      />
      <FournisseurPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        fournisseur={selectedFournisseur}
        onEdit={() => {
          setShowPreviewModal(false);
          setShowEditModal(true);
        }}
      />
    </div>
  );
}
