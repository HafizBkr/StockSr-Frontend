'use client';
import React from 'react';
import { X, User, ShieldCheck, Lock, UserCheck } from 'lucide-react';

type UserRole = 'cashier' | 'subadmin';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name?: string;
    email?: string;
    username?: string;
    role: UserRole;
    status: 'active' | 'inactive';
    createdAt: Date | null;
  } | null;
}

const roleLabel = (role: UserRole) => (role === 'cashier' ? 'Caissier' : 'Subadmin');

const roleIcon = (role: UserRole) =>
  role === 'cashier' ? (
    <User size={22} className="text-blue-500" />
  ) : (
    <ShieldCheck size={22} className="text-purple-500" />
  );

const statusBadge = (status: 'active' | 'inactive') =>
  status === 'active' ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <UserCheck size={14} className="mr-1" /> Actif
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <Lock size={14} className="mr-1" /> Inactif
    </span>
  );

function formatDate(date: Date) {
  return (
    date.toLocaleDateString('fr-FR') +
    ' ' +
    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              {roleIcon(user.role)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Détails utilisateur</h2>
              <p className="text-zinc-600 text-sm">{roleLabel(user.role)}</p>
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

        {/* Infos utilisateur */}
        <div className="p-6 space-y-6">
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">Nom</div>
            <div className="text-zinc-900 font-medium">
              {user.name || user.username || <span className="italic text-zinc-400">-</span>}
            </div>
          </div>
          {user.role === 'subadmin' && (
            <div>
              <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">Email</div>
              <div className="text-zinc-900">
                {user.email || <span className="italic text-zinc-400">-</span>}
              </div>
            </div>
          )}
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">Rôle</div>
            <div className="text-zinc-900">{roleLabel(user.role)}</div>
          </div>
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">Statut</div>
            {statusBadge(user.status)}
          </div>
          <div>
            <div className="mb-2 text-xs text-zinc-500 font-semibold uppercase">
              Date de création
            </div>
            <div className="text-zinc-900">
              {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
