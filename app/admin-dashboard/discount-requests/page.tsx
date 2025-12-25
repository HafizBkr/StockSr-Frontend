"use client";
import { useAdminRequireAuth } from "../../../hooks/useAdminRequireAuth";

export default function DiscountRequestsPage() {
  useAdminRequireAuth();
  return <div className="min-h-screen bg-white" />;
}
