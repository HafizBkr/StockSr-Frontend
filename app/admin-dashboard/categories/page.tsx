"use client";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

export default function CategoriesPage() {
  useAdminRequireAuth();
  return <div className="min-h-screen bg-white" />;
}
