"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  Boxes,
  Truck,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(true); // SSR-safe: toujours la même valeur initiale
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth < 1024 && open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pathname = usePathname();

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
    {
      label: "Gestion Utilisateur",
      icon: Users,
      href: "/admin-dashboard/users",
    },
  ];

  const menu = baseMenu;

  const handleLogout = () => {
    // Vider le localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    // Rediriger vers la page de login admin
    router.push("/admin-login-xyz");
  };

  return (
    <aside
      className={`hidden md:flex fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-zinc-50 to-white border-r border-zinc-200 shadow-lg flex-col transition-all duration-300 ${
        open ? "w-64" : "w-20"
      } ${className}`}
    >
      {/* Header */}
      <div className="relative flex items-center h-16 px-5 border-b border-zinc-200">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
            <Boxes size={18} className="text-white" />
          </div>

          <h1
            className={`font-semibold text-xl tracking-tight text-zinc-800 transition-all duration-300 ${
              open ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            StockR
          </h1>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 bg-white border border-zinc-300 shadow-md rounded-full hover:bg-zinc-50 transition-all active:scale-95"
        >
          <ChevronLeft
            size={16}
            className={`text-zinc-600 transition-transform duration-300 ${
              open ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
              className={`group relative flex items-center w-full p-3 rounded-lg transition-all ${
                open ? "gap-3" : "justify-center"
              } ${
                isActive
                  ? "bg-zinc-200/70 text-zinc-900 shadow-inner"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Icon
                size={20}
                className={`transition-colors shrink-0 ${
                  isActive ? "text-zinc-900" : "group-hover:text-indigo-500"
                }`}
              />

              <span
                className={`text-sm font-medium whitespace-nowrap transition-all ${
                  open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.label}
              </span>

              {!open && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 w-2 h-2 bg-zinc-900 rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        className={`p-4 border-t border-zinc-200 ${open ? "" : "flex justify-center"}`}
      >
        <div
          className={`flex items-center gap-3 p-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-all cursor-pointer ${
            open ? "" : "w-12 h-12 justify-center"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center">
            <User size={16} className="text-zinc-700" />
          </div>

          {open && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">
                deviameyoessenam@...
              </p>
              <p className="text-xs text-zinc-500 truncate">Super Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-200">
        <button
          onClick={handleLogout}
          className={`group relative flex items-center w-full p-3 rounded-lg hover:bg-zinc-100 text-red-600 transition-all ${
            open ? "gap-3" : "justify-center"
          }`}
        >
          <LogOut size={20} className="shrink-0" />

          <span
            className={`text-sm font-medium transition-all ${
              open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Déconnexion
          </span>

          {!open && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              Déconnexion
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-zinc-900 rotate-45" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
