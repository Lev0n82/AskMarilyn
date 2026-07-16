import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

interface UseAuthOptions {
  redirectOnUnauthenticated?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectOnUnauthenticated = false } = options;

  const { data: user, isLoading: loading, error } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logoutMutation = trpc.auth.logout.useMutation();

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/login";
  }, [logoutMutation]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user: user ?? null,
    loading,
    error,
    isAuthenticated,
    logout,
  };
}
