"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import KPICard from "../../../components/dashboard/kpi-card";
import {
  User as UserIcon,
  ShieldCheck,
  Lock,
  Search,
  Plus,
  Eye,
  Edit,
  Menu,
} from "lucide-react";
import { Input, Button } from "../../../components/ui";
import CustomSelect from "../../../components/ui/CustomSelect";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import ViewUserModal from "./ViewUserModal";
import ClientOnlyDate from "../../../components/ClientOnlyDate";

type UserRole = "cashier" | "subadmin";

interface UserRow {
  id: string;
  name: string;
  email?: string;
  createdAt: Date | null;
  status: "active" | "inactive";
  role: UserRole;
}

// Données mockées pour la démonstration
const mockUsers: UserRow[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    createdAt: new Date("2024-01-15"),
    status: "active",
    role: "subadmin",
  },
  {
    id: "2",
    name: "Marie Martin",
    createdAt: new Date("2024-02-20"),
    status: "active",
    role: "cashier",
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    createdAt: new Date("2024-01-10"),
    status: "inactive",
    role: "subadmin",
  },
  {
    id: "4",
    name: "Sophie Bernard",
    createdAt: new Date("2024-03-05"),
    status: "active",
    role: "cashier",
  },
  {
    id: "5",
    name: "Luc Moreau",
    createdAt: new Date("2024-02-28"),
    status: "inactive",
    role: "cashier",
  },
];

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [users, setUsers] = useState<UserRow[]>(mockUsers);

  // État pour la sidebar mobile
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const handleOpenSidebar = () => setSidebarMobileOpen(true);
  const handleCloseSidebar = () => setSidebarMobileOpen(false);

  // Fonction pour basculer le statut d'un utilisateur
  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    );
  };

  // Filtrage
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesSearch = user.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  // KPI
  const totalCashiers = users.filter((u) => u.role === "cashier").length;
  const activeCashiers = users.filter(
    (u) => u.role === "cashier" && u.status === "active",
  ).length;
  const inactiveCashiers = users.filter(
    (u) => u.role === "cashier" && u.status === "inactive",
  ).length;

  const totalSubadmins = users.filter((u) => u.role === "subadmin").length;
  const activeSubadmins = users.filter(
    (u) => u.role === "subadmin" && u.status === "active",
  ).length;
  const inactiveSubadmins = users.filter(
    (u) => u.role === "subadmin" && u.status === "inactive",
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans overflow-x-hidden flex flex-col md:flex-row">
      {/* Bouton hamburger mobile */}
      {!sidebarMobileOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-lg p-3 rounded-full flex items-center justify-center"
          onClick={handleOpenSidebar}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-7 h-7 text-white" />
        </button>
      )}

      <Sidebar />

      {/* Sidebar mobile drawer */}
      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleCloseSidebar}
          />
          <div className="relative z-50 w-64 h-full shadow-xl">
            <MobileSidebar onClose={handleCloseSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="w-full">
            {/* Titre & sous-titre */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 mb-1 md:mb-2">
                Gestion des Utilisateurs
              </h1>
              <p className="text-zinc-600 text-sm md:text-base">
                Gérez les comptes des caissiers et subadmins, et consultez leurs
                sessions.
              </p>
            </div>

            {/* KPI Cards - Caissiers & Subadmins côte à côte */}
            <div className="mb-6 md:mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                {/* Caissiers */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                    Caissiers
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KPICard
                      title="Total"
                      value={totalCashiers}
                      icon={UserIcon}
                      color="blue"
                    />
                    <KPICard
                      title="Actifs"
                      value={activeCashiers}
                      icon={ShieldCheck}
                      color="green"
                    />
                    <KPICard
                      title="Inactifs"
                      value={inactiveCashiers}
                      icon={Lock}
                      color="red"
                    />
                  </div>
                </div>
                {/* Subadmins */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                    Subadmins
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KPICard
                      title="Total"
                      value={totalSubadmins}
                      icon={ShieldCheck}
                      color="purple"
                    />
                    <KPICard
                      title="Actifs"
                      value={activeSubadmins}
                      icon={ShieldCheck}
                      color="green"
                    />
                    <KPICard
                      title="Inactifs"
                      value={inactiveSubadmins}
                      icon={Lock}
                      color="red"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 lg:max-w-xs">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-11 pr-4 py-2.5 bg-transparent border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all text-sm text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                  <CustomSelect
                    value={roleFilter}
                    onChange={(value) =>
                      setRoleFilter(value as UserRole | "all")
                    }
                    options={[
                      { value: "all", label: "Tous les rôles" },
                      { value: "cashier", label: "Caissiers" },
                      { value: "subadmin", label: "Subadmins" },
                    ]}
                    placeholder="Tous les rôles"
                    containerClassName="min-w-[160px]"
                  />
                  <CustomSelect
                    value={statusFilter}
                    onChange={(value) =>
                      setStatusFilter(value as "all" | "active" | "inactive")
                    }
                    options={[
                      { value: "all", label: "Tous les statuts" },
                      { value: "active", label: "Actif" },
                      { value: "inactive", label: "Inactif" },
                    ]}
                    placeholder="Tous les statuts"
                    containerClassName="min-w-[160px]"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    leftIcon={<Plus size={18} />}
                    onClick={() => setShowAddModal(true)}
                  >
                    <span className="hidden sm:inline">
                      Ajouter un utilisateur
                    </span>
                    <span className="sm:hidden">Ajouter</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              {/* Vue Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Nom d&apos;utilisateur
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Statut
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Rôle
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Date de création
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="flex flex-col items-center justify-center py-16">
                            <UserIcon
                              size={48}
                              className="text-zinc-200 mb-4"
                            />
                            <div className="text-lg font-medium text-zinc-900 mb-2">
                              Aucun utilisateur trouvé
                            </div>
                            <div className="text-zinc-500">
                              Aucun utilisateur ne correspond à vos critères de
                              recherche.
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-zinc-50 transition-colors"
                        >
                          <td className="px-4 lg:px-6 py-4 flex items-center gap-3">
                            <UserIcon size={22} className="text-zinc-400" />
                            <span className="font-medium text-zinc-900">
                              {user.name}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <button
                              type="button"
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                              title={`Cliquer pour ${user.status === "active" ? "désactiver" : "activer"} ce compte`}
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === "active" ? "Actif" : "Inactif"}
                            </button>
                          </td>
                          <td className="px-4 lg:px-6 py-4 capitalize text-zinc-900">
                            {user.role === "cashier" ? "Caissier" : "Subadmin"}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-zinc-900">
                            {user.createdAt ? (
                              <ClientOnlyDate date={user.createdAt} />
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-right">
                            <button
                              className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Voir les détails"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowViewModal(true);
                              }}
                            >
                              <Eye size={20} />
                            </button>
                            <button
                              className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all ml-2"
                              title="Modifier"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Vue Mobile */}
              <div className="md:hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <UserIcon size={48} className="mb-4 text-zinc-300" />
                      <h3 className="text-lg font-medium text-zinc-900 mb-2">
                        Aucun utilisateur trouvé
                      </h3>
                      <p className="text-sm">
                        Aucun utilisateur ne correspond à vos critères de
                        recherche.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 border-b border-zinc-200 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <UserIcon size={20} className="text-zinc-400" />
                          <span className="font-medium text-zinc-900">
                            {user.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir les détails"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowViewModal(true);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-2 text-zinc-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifier"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-600">Statut:</span>
                          <button
                            type="button"
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                            title={`Cliquer pour ${user.status === "active" ? "désactiver" : "activer"} ce compte`}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "active" ? "Actif" : "Inactif"}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-600">Rôle:</span>
                          <span className="text-sm capitalize text-zinc-900">
                            {user.role === "cashier" ? "Caissier" : "Subadmin"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-600">
                            Créé le:
                          </span>
                          <span className="text-sm text-zinc-900">
                            {user.createdAt ? (
                              <ClientOnlyDate date={user.createdAt} />
                            ) : (
                              "N/A"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(userData: UserRow) => {
          // Simulation d'ajout d'utilisateur
          const newUser: UserRow = {
            id: String(users.length + 1),
            name: userData.name,
            email: userData.email,
            createdAt: new Date(),
            status: "active",
            role: userData.role,
          };
          setUsers((prev) => [...prev, newUser]);
          setShowAddModal(false);
        }}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={
          selectedUser
            ? {
                id: selectedUser.id,
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role,
                status: selectedUser.status,
              }
            : null
        }
        onSave={(userData: {
          id: string;
          name: string;
          email?: string;
          role: UserRole;
        }) => {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === userData.id
                ? {
                    ...user,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                  }
                : user,
            ),
          );
          setShowEditModal(false);
          setSelectedUser(null);
        }}
      />

      <ViewUserModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        user={
          selectedUser
            ? {
                id: selectedUser.id,
                name: selectedUser.name,
                email: selectedUser.email,
                username:
                  selectedUser.role === "cashier"
                    ? selectedUser.name
                    : undefined,
                role: selectedUser.role,
                status: selectedUser.status,
                createdAt: selectedUser.createdAt,
              }
            : null
        }
      />
    </div>
  );
}
