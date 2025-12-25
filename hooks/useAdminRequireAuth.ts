import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./useAdminAuth";

/**
 * Hook de protection d'accès pour les pages admin.
 * Redirige vers la page de login si l'utilisateur n'est pas authentifié.
 */
export function useAdminRequireAuth() {
  const router = useRouter();
  const { token, user, initialized } = useAdminAuth();

  useEffect(() => {
    if (initialized && (!token || !user)) {
      router.replace("/admin-login-xyz");
    }
  }, [token, user, initialized, router]);
}

export default useAdminRequireAuth;
