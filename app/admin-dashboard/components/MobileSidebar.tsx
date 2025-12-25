"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  Boxes,
  Truck,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  User,
  Tag,
  X,
  AlertCircle,
} from "lucide-react";

interface MobileSidebarProps {
  onClose: () => void;
}

export default function MobileSidebar({ onClose }: MobileSidebarProps) {
  // Suppression du hook d'authentification, valeurs statiques pour la démo
  const user = { email: "admin@email.com" };
  const userIsSuperAdmin = true;
  const pathname = usePathname();
  const router = useRouter();

  // Menu de base accessible à tous
  const baseMenu = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin-dashboard" },
    {
      label: "Produits",
      icon: PackageSearch,
      href: "/admin-dashboard/products",
    },
    { label: "Catégories", icon: Tag, href: "/admin-dashboard/categories" },
    {
      label: "Fournisseurs",
      icon: Truck,
      href: "/admin-dashboard/fournisseurs",
    },
    { label: "Ventes", icon: BarChart3, href: "/admin-dashboard/sales-list" },
    {
      label: "Demandes de Réduction",
      icon: AlertCircle,
      href: "/admin-dashboard/discount-requests",
    },
    {
      label: "Historique de restocks",
      icon: ClipboardList,
      href: "/admin-dashboard/restocks-history",
    },
  ];

  // Menu réservé au superadmin uniquement
  const adminOnlyMenu = [
    {
      label: "Gestion Utilisateur",
      icon: Users,
      href: "/admin-dashboard/users",
    },
  ];

  // Construire le menu selon le rôle
  const menu = userIsSuperAdmin ? [...baseMenu, ...adminOnlyMenu] : baseMenu;

  const handleLinkClick = () => {
    // Fermer le drawer quand on clique sur un lien
    onClose();
  };

  const handleLogout = () => {
    // Vider le localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    // Fermer la sidebar mobile
    onClose();

    // Rediriger vers la page de login admin
    router.push("/admin-login-xyz");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header avec bouton fermeture */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
            <Boxes size={20} className="text-white" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight text-zinc-800">
            OKPE ODAYE
          </h1>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={20} className="text-zinc-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin-dashboard"
              ? pathname === "/admin-dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                  : "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
              }`}
            >
              <Icon
                size={22}
                className={`shrink-0 ${isActive ? "text-indigo-600" : "text-zinc-500"}`}
              />
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-200">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50">
          <div className="w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center">
            <User size={18} className="text-zinc-700" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-800 truncate">
              {user?.email || "Admin User"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {userIsSuperAdmin ? "Super Admin" : "Sub Admin"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-red-50 text-red-600 transition-all"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="text-base font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
