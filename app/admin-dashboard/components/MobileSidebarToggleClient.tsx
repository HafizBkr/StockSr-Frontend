'use client';
import { Menu } from 'lucide-react';

export default function MobileSidebarToggleClient({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-lg p-3 rounded-full flex items-center justify-center"
      onClick={onOpen}
      aria-label="Ouvrir le menu"
    >
      <Menu className="w-7 h-7 text-white" />
    </button>
  );
}
