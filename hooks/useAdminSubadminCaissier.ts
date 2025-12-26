import { useState, useCallback } from "react";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type ResourceType = "subadmins" | "caissiers";

// Les payloads restent génériques pour la création/màj
interface CreatePayload {
  // Pour caissier
  username?: string;
  password?: string;
  // Pour subadmin
  subadmin_email?: string;
  subadmin_name?: string;
  subadmin_password?: string;
}

interface UpdatePayload {
  // Pour caissier
  username?: string;
  password?: string;
  // Pour subadmin
  subadmin_email?: string;
  subadmin_name?: string;
  subadmin_password?: string;
  // Pour activation/désactivation
  is_active?: boolean;
}

// Hook générique
interface UseAdminSubadminCaissierResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  createOne: (payload: CreatePayload) => Promise<T | null>;
  updateOne: (id: string, payload: UpdatePayload) => Promise<T | null>;
  deleteOne: (id: string) => Promise<boolean>;
}

/**
 * Hook pour gérer les subadmins et caissiers (CRUD) avec token super admin.
 */
export function useAdminSubadminCaissier<T = unknown>({
  resource,
  token,
}: {
  resource: ResourceType;
  token: string;
}): UseAdminSubadminCaissierResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper pour l'URL
  const getUrl = (id?: string) =>
    `${BACKEND_API_URL}/admin/${resource}${id ? `/${id}` : ""}`;

  // Lister tous
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getUrl(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Erreur lors du chargement");
      }
      const result = await res.json();
      setData(result.data[resource] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, resource]);

  // Créer un subadmin/caissier
  const createOne = useCallback(
    async (payload: CreatePayload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(getUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.message || "Erreur lors de la création");
        }
        const created = await res.json();
        // Rafraîchir la liste
        await fetchAll();
        return created as T;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, resource, fetchAll],
  );

  // Modifier un subladmin/caissier
  const updateOne = useCallback(
    async (id: string, payload: UpdatePayload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(getUrl(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.message || "Erreur lors de la modification");
        }
        const updated = await res.json();
        // Rafraîchir la liste
        await fetchAll();
        return updated as T;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, resource, fetchAll],
  );

  // Supprimer un subladmin/caissier
  const deleteOne = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(getUrl(id), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.message || "Erreur lors de la suppression");
        }
        // Rafraîchir la liste
        await fetchAll();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, resource, fetchAll],
  );

  return {
    data,
    loading,
    error,
    fetchAll,
    createOne,
    updateOne,
    deleteOne,
  };
}

export default useAdminSubadminCaissier;
