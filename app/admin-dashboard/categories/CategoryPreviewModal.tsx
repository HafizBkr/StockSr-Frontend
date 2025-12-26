"use client";
import React from "react";
import { X, Eye, Edit, User as UserIcon, Calendar } from "lucide-react";
import { Categorie } from "../../../models/Categorie";

interface CategoryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Categorie | null;
  onEdit: (category: Categorie) => void;
}

const CategoryPreviewModal: React.FC<CategoryPreviewModalProps> = ({
  isOpen,
  onClose,
  category,
  onEdit,
}) => {
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
            <div className="text-black font-medium">{category.nom}</div>
          </div>
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Description
            </div>
            <div className="text-black">
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
};

export default CategoryPreviewModal;
