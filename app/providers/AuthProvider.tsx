"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/app/utils/apiClient";

const PUBLIC_ROUTES = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      // If not authenticated and trying to access protected route
      if (!authenticated && !isPublicRoute) {
        // Store intended destination
        if (typeof window !== "undefined") {
          sessionStorage.setItem("redirectAfterLogin", pathname);
        }
        router.push("/login?error=session_expired");
        return;
      }

      // If authenticated and trying to access login page
      if (authenticated && isPublicRoute) {
        router.push("/dashboard");
        return;
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}