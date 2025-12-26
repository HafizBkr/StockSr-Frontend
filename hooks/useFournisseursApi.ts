import { useState, useCallback } from "react";
import type {
  Fournisseur,
  FournisseurCreate,
  FournisseurUpdate,
  FournisseurApiResponse,
} from "../models/fournisseur";
import {
  mapApiResponseToFournisseur,
  mapFournisseurToApiCreate,
  mapFournisseurToApiUpdate,
} from "../models/fournisseur";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7003";

export function useFournisseursApi(token: string | null) {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFournisseurs = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/admin/fournisseurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data:
        | FournisseurApiResponse[]
        | { success: boolean; fournisseurs: FournisseurApiResponse[] } =
        await response.json();

      if (Array.isArray(data)) {
        setFournisseurs(data.map(mapApiResponseToFournisseur));
      } else if (data.success && data.fournisseurs) {
        setFournisseurs(data.fournisseurs.map(mapApiResponseToFournisseur));
      } else {
        throw new Error("Erreur lors du chargement des fournisseurs");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      console.error("Erreur fetchFournisseurs:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchFournisseurById = useCallback(
    async (fournisseurId: string): Promise<Fournisseur | null> => {
      if (!token) return null;

      try {
        const response = await fetch(
          `${BASE_URL}/admin/fournisseurs/${fournisseurId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data:
          | FournisseurApiResponse
          | { success: boolean; fournisseur: FournisseurApiResponse } =
          await response.json();

        if ("success" in data && data.success && data.fournisseur) {
          return mapApiResponseToFournisseur(data.fournisseur);
        } else if ("fournisseur_id" in data) {
          return mapApiResponseToFournisseur(data);
        } else {
          throw new Error("Fournisseur introuvable");
        }
      } catch (err) {
        console.error("Erreur fetchFournisseurById:", err);
        return null;
      }
    },
    [token],
  );

  const createFournisseur = useCallback(
    async (fournisseurData: FournisseurCreate): Promise<boolean> => {
      if (!token) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/admin/fournisseurs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mapFournisseurToApiCreate(fournisseurData)),
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Recharger la liste des fournisseurs
          await fetchFournisseurs();
          return true;
        } else {
          throw new Error(
            data.message || "Erreur lors de la création du fournisseur",
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        console.error("Erreur createFournisseur:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchFournisseurs],
  );

  const updateFournisseur = useCallback(
    async (
      fournisseurId: string,
      updates: FournisseurUpdate,
    ): Promise<boolean> => {
      if (!token) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BASE_URL}/admin/fournisseurs/${fournisseurId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mapFournisseurToApiUpdate(updates)),
          },
        );

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Mettre à jour le fournisseur dans la liste locale
          setFournisseurs((prev) =>
            prev.map((f) =>
              f.fournisseur_id === fournisseurId
                ? { ...f, ...updates, updated_at: new Date() }
                : f,
            ),
          );
          return true;
        } else {
          throw new Error(
            data.message || "Erreur lors de la modification du fournisseur",
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        console.error("Erreur updateFournisseur:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const toggleFournisseurStatus = useCallback(
    async (fournisseurId: string): Promise<boolean> => {
      const fournisseur = fournisseurs.find(
        (f) => f.fournisseur_id === fournisseurId,
      );
      if (!fournisseur) return false;

      return await updateFournisseur(fournisseurId, {
        is_active: !fournisseur.is_active,
      });
    },
    [fournisseurs, updateFournisseur],
  );

  // Utilitaires
  const getActiveFournisseurs = useCallback(() => {
    return fournisseurs.filter((f) => f.is_active);
  }, [fournisseurs]);

  const getFournisseurById = useCallback(
    (fournisseurId: string) => {
      return (
        fournisseurs.find((f) => f.fournisseur_id === fournisseurId) || null
      );
    },
    [fournisseurs],
  );

  const getFournisseurName = useCallback(
    (fournisseurId: string) => {
      const fournisseur = getFournisseurById(fournisseurId);
      return fournisseur?.nom || "Fournisseur inconnu";
    },
    [getFournisseurById],
  );

  return {
    // État
    fournisseurs,
    loading,
    error,

    // Actions
    fetchFournisseurs,
    fetchFournisseurById,
    createFournisseur,
    updateFournisseur,
    toggleFournisseurStatus,

    // Utilitaires
    getActiveFournisseurs,
    getFournisseurById,
    getFournisseurName,

    // Actions de l'état
    setError,
  };
}
