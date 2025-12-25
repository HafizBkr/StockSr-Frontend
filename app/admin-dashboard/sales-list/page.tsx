"use client";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

export default function SalesListPage() {
  useAdminRequireAuth();
  return <div className="min-h-screen bg-white" />;
}
