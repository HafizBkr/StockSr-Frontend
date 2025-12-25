import { useState, useEffect } from "react";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface LoginBody {
  email: string;
  password: string;
}

interface AdminUser {
  id: number;
  email: string;
  role: string; // "admin" ou "subadmin"
}

interface AuthResponse {
  token: string;
  user: AdminUser;
}

interface UseAdminAuthResult {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (body: LoginBody) => Promise<void>;
  logout: () => void;
  initialized: boolean;
}

/**
 * Hook d'authentification pour l'espace admin/subadmin.
 * Gère la connexion, le token, l'utilisateur, les états de chargement et d'erreur.
 */
export function useAdminAuth(): UseAdminAuthResult {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Restaurer la session depuis le localStorage au chargement du hook
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    const savedUser = localStorage.getItem("admin_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setInitialized(true);
  }, []);

  // Fonction de connexion
  const login = async ({ email, password }: LoginBody) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_API_URL}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Essaye de lire le message d'erreur retourné par l'API
        let message = "Erreur lors de la connexion";
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const data: AuthResponse = await response.json();
      setToken(data.token);
      setUser(data.user);

      // Optionnel : stocker le token dans le localStorage pour persistance
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur inconnue");
      } else {
        setError("Erreur inconnue");
      }
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  };

  // Optionnel : restaurer la session depuis le localStorage au chargement du hook
  // (utile si tu veux garder la session après refresh)
  // useEffect(() => {
  //   const savedToken = localStorage.getItem('admin_token');
  //   const savedUser = localStorage.getItem('admin_user');
  //   if (savedToken && savedUser) {
  //     setToken(savedToken);
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, []);

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    initialized,
  };
}

export default useAdminAuth;
