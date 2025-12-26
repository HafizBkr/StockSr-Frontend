"use client";
import { useState } from "react";
import { X, Package } from "lucide-react";
import type { ProduitCreate } from "../../../../models/produit";

interface Categorie {
  categorie_id: string;
  nom: string;
  is_active: boolean;
}

interface Fournisseur {
  fournisseur_id: string;
  nom: string;
  is_active: boolean;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Categorie[];
  fournisseurs: Fournisseur[];
  onSuccess?: (data: ProduitCreate) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  categories,
  fournisseurs,
  onSuccess,
}: AddProductModalProps) {
  const [formData, setFormData] = useState<ProduitCreate>({
    nom: "",
    prix_achat: 0,
    prix_vente: 0,
    unite: "",
    quantite_stock: 0,
    seuil_alerte: 0,
    categorie_id: "",
    fournisseur_id: "",
    description: "",
    reference: "",
    code_barre: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom du produit est requis";
    if (!formData.categorie_id)
      newErrors.categorie_id = "La catégorie est requise";
    if (!formData.fournisseur_id)
      newErrors.fournisseur_id = "Le fournisseur est requis";
    if (!formData.unite.trim()) newErrors.unite = "L'unité est requise";
    if (formData.prix_achat <= 0)
      newErrors.prix_achat = "Le prix d'achat doit être > 0";
    if (formData.prix_vente <= 0)
      newErrors.prix_vente = "Le prix de vente doit être > 0";
    if (formData.prix_vente <= formData.prix_achat)
      newErrors.prix_vente =
        "Le prix de vente doit être supérieur au prix d'achat";
    if (formData.quantite_stock < 0)
      newErrors.quantite_stock = "Le stock doit être positif";
    if (formData.seuil_alerte < 0)
      newErrors.seuil_alerte = "Le seuil d'alerte doit être positif";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ProduitCreate,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      onSuccess?.({
        ...formData,
        nom: formData.nom.trim(),
        description: formData.description?.trim() || undefined,
        reference: formData.reference?.trim() || undefined,
        code_barre: formData.code_barre?.trim() || undefined,
      });
      // Reset form
      setFormData({
        nom: "",
        prix_achat: 0,
        prix_vente: 0,
        unite: "",
        quantite_stock: 0,
        seuil_alerte: 0,
        categorie_id: "",
        fournisseur_id: "",
        description: "",
        reference: "",
        code_barre: "",
      });
      setErrors({});
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 pt-4 sm:pt-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden relative shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Ajouter un produit
              </h2>
              <p className="text-zinc-600">
                Ajoutez un nouveau produit à votre inventaire
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
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom du produit */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.nom ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="Ex: iPhone 14 Pro Max"
                  required
                />
                {errors.nom && (
                  <div className="text-xs text-red-500 mt-1">{errors.nom}</div>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.categorie_id}
                  onChange={(e) =>
                    handleInputChange("categorie_id", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.categorie_id ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories
                    .filter((cat) => cat.is_active)
                    .map((category) => (
                      <option
                        key={category.categorie_id}
                        value={category.categorie_id}
                      >
                        {category.nom}
                      </option>
                    ))}
                </select>
                {errors.categorie_id && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.categorie_id}
                  </div>
                )}
              </div>

              {/* Fournisseur */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Fournisseur
                </label>
                <select
                  value={formData.fournisseur_id}
                  onChange={(e) =>
                    handleInputChange("fournisseur_id", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.fournisseur_id ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  required
                >
                  <option value="">Sélectionnez un fournisseur</option>
                  {fournisseurs
                    .filter((fournisseur) => fournisseur.is_active)
                    .map((fournisseur) => (
                      <option
                        key={fournisseur.fournisseur_id}
                        value={fournisseur.fournisseur_id}
                      >
                        {fournisseur.nom}
                      </option>
                    ))}
                </select>
                {errors.fournisseur_id && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.fournisseur_id}
                  </div>
                )}
              </div>

              {/* Unité */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Unité
                </label>
                <input
                  type="text"
                  value={formData.unite}
                  onChange={(e) => handleInputChange("unite", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.unite ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="Ex: kg, carton, palette..."
                  required
                />
                {errors.unite && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.unite}
                  </div>
                )}
              </div>

              {/* Stock initial */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Stock initial
                </label>
                <input
                  type="number"
                  value={formData.quantite_stock}
                  onChange={(e) =>
                    handleInputChange("quantite_stock", Number(e.target.value))
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.quantite_stock ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="0"
                  min="0"
                  required
                />
                {errors.quantite_stock && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.quantite_stock}
                  </div>
                )}
              </div>

              {/* Seuil d'alerte */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Seuil d&apos;alerte
                </label>
                <input
                  type="number"
                  value={formData.seuil_alerte}
                  onChange={(e) =>
                    handleInputChange("seuil_alerte", Number(e.target.value))
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.seuil_alerte ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="0"
                  min="0"
                  required
                />
                {errors.seuil_alerte && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.seuil_alerte}
                  </div>
                )}
              </div>

              {/* Prix d'achat */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Prix d&apos;chat (FCFA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prix_achat}
                  onChange={(e) =>
                    handleInputChange("prix_achat", Number(e.target.value))
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.prix_achat ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="0.00"
                  min="0"
                  required
                />
                {errors.prix_achat && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.prix_achat}
                  </div>
                )}
              </div>

              {/* Prix de vente */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Prix de vente (FCFA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prix_vente}
                  onChange={(e) =>
                    handleInputChange("prix_vente", Number(e.target.value))
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.prix_vente ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="0.00"
                  min="0"
                  required
                />
                {errors.prix_vente && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.prix_vente}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="Description du produit (optionnel)"
                />
                {errors.description && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Référence */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Référence
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    handleInputChange("reference", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.reference ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="Référence interne ou fournisseur (optionnel)"
                />
                {errors.reference && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.reference}
                  </div>
                )}
              </div>

              {/* Code-barres */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Code-barres
                </label>
                <input
                  type="text"
                  value={formData.code_barre}
                  onChange={(e) =>
                    handleInputChange("code_barre", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.code_barre ? "border-red-400" : "border-zinc-200"
                  } focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                  placeholder="Code-barres (optionnel)"
                />
                {errors.code_barre && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.code_barre}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Ajout en cours..." : "Ajouter le produit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
