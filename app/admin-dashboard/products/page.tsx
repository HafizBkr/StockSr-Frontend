"use client";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

export default function ProductsPage() {
  useAdminRequireAuth();
  return <div className="min-h-screen bg-white" />;
}
