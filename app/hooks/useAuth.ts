"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, removeAuthToken, api } from "@/app/utils/apiClient";
import { useError } from "@/app/providers/ErrorProvider";

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  validateWithApi?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const {
    requireAuth = false,
    redirectTo = "/login",
    validateWithApi = false,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const { showError } = useError();
  const [isChecking, setIsChecking] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      // Check if token exists and is not expired (client-side check)
      const authenticated = isAuthenticated();

      if (!authenticated) {
        setIsValidToken(false);
        if (requireAuth && pathname !== redirectTo) {
          showError("Session expired. Please login again.");
          router.push(redirectTo);
        }
        setIsChecking(false);
        return;
      }

      // Optionally validate token with API
      if (validateWithApi) {
        try {
          // Call a verify token endpoint
          await api.get("auth/verify", { skipErrorHandler: true });
          setIsValidToken(true);
        } catch (error) {
          setIsValidToken(false);
          removeAuthToken();
          if (requireAuth && pathname !== redirectTo) {
            showError("Invalid session. Please login again.");
            router.push(redirectTo);
          }
        }
      } else {
        setIsValidToken(true);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, requireAuth, redirectTo, validateWithApi, router, showError]);

  return { isAuthenticated: isValidToken, isChecking };
}