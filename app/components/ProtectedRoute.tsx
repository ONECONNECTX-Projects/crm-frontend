"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/app/utils/apiClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication on mount and route changes
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      if (!authenticated && pathname !== "/login") {
        // Store the intended destination
        router.push("/login?error=session_expired");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Check authentication synchronously for initial render
  const authenticated = isAuthenticated();

  if (!authenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}