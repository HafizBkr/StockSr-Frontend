import { useState, useCallback } from "react";
import { Categorie } from "../models/Categorie";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CategorieApiResponse {
  categorie_id: string;
  nom: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
  created_by_id: string;
  created_by_type: "admin" | "subadmin";
  created_by_username?: string;
  updated_at?: string;
  updated_by?: string;
  updated_by_id?: string;
  updated_by_type?: "admin" | "subadmin";
  updated_by_username?: string;
}

interface CategorieApiCreate {
  nom: string;
  description?: string;
}

interface CategorieApiUpdate {
  nom?: string;
  description?: string;
  is_active?: boolean;
}

function mapApiToCategorie(apiCat: CategorieApiResponse): Categorie {
  return {
    categorie_id: apiCat.categorie_id,
    nom: apiCat.nom,
    description: apiCat.description,
    is_active: apiCat.is_active,
    created_at: new Date(apiCat.created_at),
    created_by: apiCat.created_by,
    created_by_id: apiCat.created_by_id,
    created_by_type: apiCat.created_by_type,
    created_by_username: apiCat.created_by_username,
    updated_at: apiCat.updated_at ? new Date(apiCat.updated_at) : undefined,
    updated_by: apiCat.updated_by,
    updated_by_id: apiCat.updated_by_id,
    updated_by_type: apiCat.updated_by_type,
    updated_by_username: apiCat.updated_by_username,
  };
}

function mapCategorieToApi(cat: Partial<Categorie>): CategorieApiUpdate {
  const apiObj: CategorieApiUpdate = {};
  if (cat.nom !== undefined) apiObj.nom = cat.nom;
  if (cat.description !== undefined) apiObj.description = cat.description;
  if (cat.is_active !== undefined) apiObj.is_active = cat.is_active;
  return apiObj;
}

export function useCategoriesApi(token: string) {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data: unknown = await res.json();
      console.log("📥 Réponse API /admin/categories:", data);
      const cats: CategorieApiResponse[] = Array.isArray(data)
        ? data
        : ((data as { data?: { categories?: CategorieApiResponse[] } }).data
            ?.categories ?? []);
      console.log("🔄 Catégories extraites:", cats);
      setCategories(cats.map(mapApiToCategorie));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // GET one category
  const getCategorieById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Catégorie introuvable");
        const data: CategorieApiResponse = await res.json();
        return mapApiToCategorie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // CREATE category
  const addCategorie = useCallback(
    async (cat: { nom: string; description?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nom: cat.nom,
            description: cat.description,
          } as CategorieApiCreate),
        });
        if (!res.ok) {
          const errData: { message?: string } = await res
            .json()
            .catch(() => ({}));
          throw new Error(errData?.message || "Erreur lors de la création");
        }
        const data: CategorieApiResponse = await res.json();
        const newCat = mapApiToCategorie(data);
        // Rafraîchir toute la liste au lieu d'une mise à jour locale
        await fetchCategories();
        return newCat;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // UPDATE category
  const updateCategorie = useCallback(
    async (id: string, cat: Partial<Categorie>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(mapCategorieToApi(cat)),
        });
        if (!res.ok) {
          const errData: { message?: string } = await res
            .json()
            .catch(() => ({}));
          throw new Error(errData?.message || "Erreur lors de la modification");
        }
        const data: CategorieApiResponse = await res.json();
        const updatedCat = mapApiToCategorie(data);
        // Rafraîchir toute la liste au lieu d'une mise à jour locale
        await fetchCategories();
        return updatedCat;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // DELETE category
  const deleteCategorie = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData: { message?: string } = await res
            .json()
            .catch(() => ({}));
          throw new Error(errData?.message || "Erreur lors de la suppression");
        }
        setCategories((prev) => prev.filter((c) => c.categorie_id !== id));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategorieById,
    addCategorie,
    updateCategorie,
    deleteCategorie,
  };
}
