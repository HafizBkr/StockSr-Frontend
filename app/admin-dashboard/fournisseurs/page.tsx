"use client";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

export default function FournisseursPage() {
  useAdminRequireAuth();
  return <div className="min-h-screen bg-white" />;
}
