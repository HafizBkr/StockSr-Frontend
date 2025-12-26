"use client";
import { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import type {
  Fournisseur,
  FournisseurUpdate,
} from "../../../../models/fournisseur";

interface EditFournisseurModalProps {
  isOpen: boolean;
  fournisseur: Fournisseur | null;
  onClose: () => void;
  onSave: (data: FournisseurUpdate) => void;
}

export default function EditFournisseurModal({
  isOpen,
  fournisseur,
  onClose,
  onSave,
}: EditFournisseurModalProps) {
  const [formData, setFormData] = useState<FournisseurUpdate>({
    nom: "",
    adresse: "",
    email: "",
    telephone: "",
    description: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (fournisseur && isOpen) {
      setFormData({
        nom: fournisseur.nom || "",
        adresse: fournisseur.adresse || "",
        email: fournisseur.email || "",
        telephone: fournisseur.telephone || "",
        description: fournisseur.description || "",
        is_active: fournisseur.is_active ?? true,
      });
      setErrors({});
    }
  }, [fournisseur, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nom?.trim())
      newErrors.nom = "Le nom du fournisseur est requis";
    if (
      formData.email &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(formData.email)
    )
      newErrors.email = "Email invalide";
    if (formData.telephone && !/^[0-9+\s().-]{6,}$/.test(formData.telephone))
      newErrors.telephone = "Numéro de téléphone invalide";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FournisseurUpdate,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      onSave({
        nom: formData.nom?.trim(),
        adresse: formData.adresse?.trim(),
        email: formData.email?.trim(),
        telephone: formData.telephone?.trim(),
        description: formData.description?.trim(),
        is_active: formData.is_active,
      });
      onClose();
    } catch (error) {
      // Gérer l'erreur si besoin
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !fournisseur) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Edit3 size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Modifier le fournisseur
              </h2>
              <p className="text-zinc-600">
                Modifiez les informations du fournisseur
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne 1 */}
            <div className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Nom du fournisseur <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.nom || ""}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  placeholder="Nom du fournisseur"
                  required
                  className="text-black"
                />
                {errors.nom && (
                  <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                )}
              </div>
              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Adresse
                </label>
                <Input
                  value={formData.adresse || ""}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  placeholder="Adresse du fournisseur"
                  className="text-black"
                />
              </div>
              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Téléphone
                </label>
                <Input
                  value={formData.telephone || ""}
                  onChange={(e) =>
                    handleInputChange("telephone", e.target.value)
                  }
                  placeholder="Téléphone du fournisseur"
                  type="tel"
                  className="text-black"
                />
                {errors.telephone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.telephone}
                  </p>
                )}
              </div>
            </div>
            {/* Colonne 2 */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email du fournisseur"
                  className="text-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Description <span className="text-zinc-400">(optionnel)</span>
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none text-black"
                  placeholder="Description du fournisseur..."
                />
              </div>
              {/* Statut actif/inactif */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Fournisseur actif
                </label>
                <div className="flex items-center gap-3">
                  <span className="relative inline-block w-11 h-6 transition duration-200 align-middle select-none">
                    <input
                      type="checkbox"
                      id="active"
                      checked={!!formData.is_active}
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
                    {formData.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
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
