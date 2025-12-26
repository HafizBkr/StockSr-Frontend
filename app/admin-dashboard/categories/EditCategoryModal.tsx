"use client";
import { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Categorie } from "../../../models/Categorie";

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

export default function EditCategoryModal({
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-black ${
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
