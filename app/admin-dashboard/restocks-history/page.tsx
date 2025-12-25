"use client";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

export default function RestocksHistoryPage() {
  useAdminRequireAuth();
  return <div className="min-h-screen bg-white" />;
}
