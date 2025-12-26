"use client";
import React from "react";
import { X, Eye, Edit } from "lucide-react";
import type { Produit } from "../../../../models/produit";

interface Categorie {
  categorie_id: string;
  nom: string;
  is_active: boolean;
}

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Produit | null;
  categories: Categorie[];
  onEdit: (product: Produit) => void;
}

export default function ProductPreviewModal({
  isOpen,
  onClose,
  product,
  categories,
  onEdit,
}: ProductPreviewModalProps) {
  if (!isOpen || !product) return null;

  const category = categories.find(
    (cat) => cat.categorie_id === product.categorie_id,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye size={28} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Aperçu du produit
              </h2>
              <p className="text-zinc-600 text-sm">{product.nom}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Nom du produit
              </div>
              <div className="text-zinc-900 font-medium">{product.nom}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                ID
              </div>
              <div className="text-zinc-900 text-sm font-mono">
                {product.produit_id}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Catégorie
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {category ? category.nom : "Inconnue"}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Statut
              </div>
              <span
                className={`font-semibold px-2 py-1 rounded-md text-xs ${
                  product.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-zinc-200 text-zinc-500"
                }`}
              >
                {product.is_active ? "Actif" : "Inactif"}
              </span>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Prix d&apos;achat
              </div>
              <div className="text-zinc-900">
                {formatCurrency(product.prix_achat)}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Prix de vente
              </div>
              <div className="text-zinc-900">
                {formatCurrency(product.prix_vente)}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Stock
              </div>
              <span
                className={`font-semibold px-2 py-1 rounded-md text-xs ${
                  product.quantite_stock <= product.seuil_alerte
                    ? "bg-red-100 text-red-700"
                    : product.quantite_stock <= product.seuil_alerte * 2
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {product.quantite_stock}
              </span>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Unité
              </div>
              <span className="font-semibold px-2 py-1 rounded-md text-xs bg-zinc-100 text-zinc-700">
                {product.unite}
              </span>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Seuil d&apos;alerte
              </div>
              <span className="font-semibold px-2 py-1 rounded-md text-xs bg-zinc-100 text-zinc-700">
                {product.seuil_alerte}
              </span>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Fournisseur ID
              </div>
              <span className="font-semibold px-2 py-1 rounded-md text-xs bg-zinc-100 text-zinc-700">
                {product.fournisseur_id}
              </span>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Date de création
              </div>
              <span className="font-semibold px-2 py-1 rounded-md text-xs bg-zinc-100 text-zinc-700">
                {new Date(product.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Dernière modification
              </div>
              <span className="font-semibold px-2 py-1 rounded-md text-xs bg-zinc-100 text-zinc-700">
                {new Date(product.updated_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Description
            </div>
            <div className="text-zinc-700">
              {product.description || (
                <span className="italic text-zinc-400">Aucune description</span>
              )}
            </div>
          </div>

          {/* Référence et code-barres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Référence
              </div>
              <div className="text-zinc-700">
                {product.reference || (
                  <span className="italic text-zinc-400">Aucune référence</span>
                )}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
                Code-barres
              </div>
              <div className="text-zinc-700">
                {product.code_barre || (
                  <span className="italic text-zinc-400">
                    Aucun code-barres
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Informations de création/modification */}
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Créé par
            </div>
            <div className="text-zinc-700">
              {product.created_by_type === "admin" ? "Admin" : "Subadmin"}
              <span className="text-zinc-500"> – {product.created_by_id}</span>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Modifié par
            </div>
            <div className="text-zinc-700">
              {product.updated_by_type === "admin" ? "Admin" : "Subadmin"}
              <span className="text-zinc-500"> – {product.updated_by_id}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-700 font-medium hover:bg-zinc-300 transition-colors"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
