"use client";
import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import type { FournisseurCreate } from "../../../../models/fournisseur";

interface AddFournisseurModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: FournisseurCreate) => void;
}

export default function AddFournisseurModal({
  isOpen,
  onClose,
  onSuccess,
}: AddFournisseurModalProps) {
  const [formData, setFormData] = useState<FournisseurCreate>({
    nom: "",
    adresse: "",
    email: "",
    telephone: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du fournisseur est requis";
    }
    if (
      formData.email &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email invalide";
    }
    if (formData.telephone && !/^[\d+\s\-()]{6,}$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FournisseurCreate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const fournisseurData: FournisseurCreate = {
        nom: formData.nom.trim(),
        adresse: formData.adresse?.trim() || "",
        email: formData.email?.trim() || "",
        telephone: formData.telephone?.trim() || "",
        description: formData.description?.trim() || "",
      };

      onSuccess?.(fournisseurData);

      // Reset form
      setFormData({
        nom: "",
        adresse: "",
        email: "",
        telephone: "",
        description: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Gérer l'erreur si besoin
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserPlus size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Ajouter un fournisseur
              </h2>
              <p className="text-zinc-600">
                Renseignez les informations du fournisseur
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
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  placeholder="Nom du fournisseur"
                  required
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
                  value={formData.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  placeholder="Adresse du fournisseur"
                />
              </div>
              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Téléphone
                </label>
                <Input
                  value={formData.telephone}
                  onChange={(e) =>
                    handleInputChange("telephone", e.target.value)
                  }
                  placeholder="Téléphone du fournisseur"
                  type="tel"
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email du fournisseur"
                  type="email"
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
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none text-black"
                  placeholder="Description du fournisseur..."
                />
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
              {isSubmitting ? "Ajout en cours..." : "Ajouter le fournisseur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
