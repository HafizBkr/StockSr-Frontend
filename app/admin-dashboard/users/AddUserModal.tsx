"use client";
import { useState } from "react";
import { X, UserPlus, User, ShieldCheck, Eye, EyeOff } from "lucide-react";

type UserRole = "cashier" | "subadmin";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: {
    id: string;
    name: string;
    email?: string;
    password: string;
    status: "active" | "inactive";
    role: UserRole;
    createdAt: Date;
  }) => void;
};

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserModalProps) {
  const [role, setRole] = useState<UserRole>("cashier");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setRole("cashier");
    setForm({ name: "", email: "", password: "" });
    setErrors({});
  };

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!form.name.trim()) newErrors.name = "Le nom est requis";
    if (!form.password.trim())
      newErrors.password = "Le mot de passe est requis";
    if (role === "subadmin") {
      if (!form.email.trim()) newErrors.email = "L'email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: "name" | "email" | "password",
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      onAdd({
        id: Date.now().toString(),
        name: form.name.trim(),
        email: role === "subadmin" ? form.email.trim() : undefined,
        password: form.password.trim(),
        status: "active",
        role,
        createdAt: new Date(),
      });
      setIsSubmitting(false);
      resetForm();
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserPlus size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Ajouter un utilisateur
              </h2>
              <p className="text-zinc-600 text-sm">
                Créez un nouveau {role === "cashier" ? "caissier" : "subadmin"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sélecteur de rôle */}
        <div className="flex justify-center gap-4 pt-6">
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
              role === "cashier"
                ? "bg-blue-50 border-blue-400 text-blue-700"
                : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-blue-50 hover:text-blue-700"
            }`}
            onClick={() => setRole("cashier")}
          >
            <User size={18} /> Caissier
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
              role === "subadmin"
                ? "bg-purple-50 border-purple-400 text-purple-700"
                : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-purple-50 hover:text-purple-700"
            }`}
            onClick={() => setRole("subadmin")}
          >
            <ShieldCheck size={18} /> Subadmin
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nom {role === "cashier" ? "du caissier" : "du subadmin"}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${errors.name ? "border-red-400" : "border-zinc-200"} focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
              placeholder={
                role === "cashier" ? "Ex: caissier1" : "Ex: subadmin1"
              }
              required
            />
            {errors.name && (
              <div className="text-xs text-red-500 mt-1">{errors.name}</div>
            )}
          </div>
          {role === "subadmin" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-400" : "border-zinc-200"} focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black`}
                placeholder="subadmin@email.com"
                required
              />
              {errors.email && (
                <div className="text-xs text-red-500 mt-1">{errors.email}</div>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${errors.password ? "border-red-400" : "border-zinc-200"} focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm text-black pr-10`}
                placeholder="Mot de passe"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-xs text-red-500 mt-1">{errors.password}</div>
            )}
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm font-medium"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
