"use client";
import React from "react";
import { X, Eye, Edit, User as UserIcon, Calendar } from "lucide-react";
import type { Fournisseur } from "../../../../models/fournisseur";

interface FournisseurPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseur: Fournisseur | null;
  onEdit: () => void;
}

const FournisseurPreviewModal: React.FC<FournisseurPreviewModalProps> = ({
  isOpen,
  onClose,
  fournisseur,
  onEdit,
}) => {
  if (!isOpen || !fournisseur) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Eye size={28} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Aperçu du fournisseur
              </h2>
              <p className="text-zinc-600">
                Détail des informations du fournisseur
              </p>
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
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne 1 */}
            <div className="space-y-6">
              {/* Nom */}
              <div>
                <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                  Nom
                </div>
                <div className="text-black font-medium">{fournisseur.nom}</div>
              </div>
              {/* Adresse */}
              <div>
                <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                  Adresse
                </div>
                <div className="text-black">
                  {fournisseur.adresse || (
                    <span className="italic text-zinc-400">Aucune adresse</span>
                  )}
                </div>
              </div>
              {/* Téléphone */}
              <div>
                <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                  Téléphone
                </div>
                <div className="text-black">
                  {fournisseur.telephone || (
                    <span className="italic text-zinc-400">
                      Aucun téléphone
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Colonne 2 */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                  Email
                </div>
                <div className="text-black">
                  {fournisseur.email || (
                    <span className="italic text-zinc-400">Aucun email</span>
                  )}
                </div>
              </div>
              {/* Description */}
              <div>
                <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                  Description
                </div>
                <div className="text-black">
                  {fournisseur.description || (
                    <span className="italic text-zinc-400">
                      Aucune description
                    </span>
                  )}
                </div>
              </div>
              {/* Statut */}
              <div>
                <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                  Statut
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    fournisseur.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {fournisseur.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              {/* Dates */}
              <div className="flex flex-col gap-2">
                <div>
                  <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                    Créé le
                  </div>
                  <div className="text-black text-xs flex items-center gap-1">
                    <Calendar size={14} className="inline" />
                    {fournisseur.created_at instanceof Date
                      ? fournisseur.created_at.toLocaleString()
                      : new Date(fournisseur.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-zinc-500 font-semibold uppercase">
                    Modifié le
                  </div>
                  <div className="text-black text-xs flex items-center gap-1">
                    <Calendar size={14} className="inline" />
                    {fournisseur.updated_at instanceof Date
                      ? fournisseur.updated_at.toLocaleString()
                      : new Date(fournisseur.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-zinc-200">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
            onClick={onEdit}
          >
            <Edit size={16} />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default FournisseurPreviewModal;
