"use client";
import React from "react";
import Sidebar from "./components/Sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      {/* Content area that adjusts based on sidebar state */}
      <div className="md:ml-20 lg:ml-64 transition-all duration-300">
        <main className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
