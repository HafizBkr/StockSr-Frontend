import { useState, useCallback } from "react";
import type { Produit, ProduitCreate, ProduitUpdate } from "../models/produit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7003";

export function useProduitsApi(token: string | null) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lister tous les produits
  const fetchProduits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/produits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      type ApiResponse = {
        success: boolean;
        message: string;
        data?: { produits: Produit[] };
      };
      const data: ApiResponse = await res.json();
      if (data.success === false) throw new Error(data.message);
      setProduits(data.data?.produits || []);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Créer un produit
  const createProduit = useCallback(
    async (produit: ProduitCreate): Promise<Produit | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/admin/produits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(produit),
        });
        type ApiResponse = {
          success: boolean;
          message: string;
          data?: { produit: Produit };
        };
        const data: ApiResponse = await res.json();
        if (data.success === false) throw new Error(data.message);
        await fetchProduits();
        return data.data?.produit;
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Erreur inconnue");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchProduits],
  );

  // Modifier un produit
  const updateProduit = useCallback(
    async (
      produit_id: string,
      updates: ProduitUpdate,
    ): Promise<Produit | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/admin/produits/${produit_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
        type ApiResponse = {
          success: boolean;
          message: string;
          data?: { produit: Produit };
        };
        const data: ApiResponse = await res.json();
        if (data.success === false) throw new Error(data.message);
        await fetchProduits();
        return data.data?.produit;
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Erreur inconnue");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchProduits],
  );

  // Récupérer un produit par ID
  const getProduit = useCallback(
    async (produit_id: string): Promise<Produit | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/admin/produits/${produit_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        type ApiResponse = {
          success: boolean;
          message: string;
          data?: { produit: Produit };
        };
        const data: ApiResponse = await res.json();
        if (data.success === false) throw new Error(data.message);
        return data.data?.produit;
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Erreur inconnue");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    produits,
    loading,
    error,
    fetchProduits,
    createProduit,
    updateProduit,
    getProduit,
  };
}
