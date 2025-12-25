"use client";
import { useState, useEffect } from "react";
import { X, User, ShieldCheck, Save } from "lucide-react";

type UserRole = "cashier" | "subadmin";

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email?: string;
    role: UserRole;
    status: "active" | "inactive";
  } | null;
  onSave: (user: {
    id: string;
    name: string;
    email?: string;
    role: UserRole;
  }) => void;
};

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "cashier" as UserRole,
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role,
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id]);

  if (!isOpen || !user) return null;

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!form.name.trim()) newErrors.name = "Le nom est requis";
    if (form.role === "subadmin") {
      if (!form.email.trim()) newErrors.email = "L’email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: user.id,
      name: form.name.trim(),
      email: form.role === "subadmin" ? form.email.trim() : undefined,
      role: form.role,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Save size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Modifier l&apos;utilisateur
              </h2>
              <p className="text-zinc-600 text-sm">
                {form.role === "cashier"
                  ? "Modifier un caissier"
                  : "Modifier un subadmin"}
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-red-400" : "border-zinc-200"
              } focus:outline-none focus:ring-2 focus:ring-green-300`}
              placeholder="Nom"
              required
            />
            {errors.name && (
              <div className="text-xs text-red-500 mt-1">{errors.name}</div>
            )}
          </div>
          {form.role === "subadmin" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-400" : "border-zinc-200"
                } focus:outline-none focus:ring-2 focus:ring-green-300`}
                placeholder="Email"
                required
              />
              {errors.email && (
                <div className="text-xs text-red-500 mt-1">{errors.email}</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
