"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/ui/loading";

// Extended role type to include admin
type UserRole = "customer" | "vendor" | "admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute - Wrapper component for protected pages
 *
 * Usage:
 * <ProtectedRoute>
 *   <YourPage />
 * </ProtectedRoute>
 *
 * With role restriction:
 * <ProtectedRoute allowedRoles={["vendor"]}>
 *   <VendorDashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to auth with return URL
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      const hasAllowedRole = allowedRoles.includes(user.role as UserRole);
      if (!hasAllowedRole) {
        // Redirect to appropriate dashboard based on role
        if (user.role === "vendor") {
          router.push("/dashboard/vendor");
        } else {
          router.push("/dashboard/customer");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoading />;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return <PageLoading />;
  }

  // Don't render if user doesn't have required role
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <PageLoading />;
  }

  return <>{children}</>;
}

/**
 * CustomerRoute - Protected route for customer-only pages
 */
export function CustomerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>{children}</ProtectedRoute>
  );
}

/**
 * VendorRoute - Protected route for vendor-only pages
 */
export function VendorRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["vendor"]}>{children}</ProtectedRoute>;
}

/**
 * GuestRoute - Route that redirects authenticated users
 */
export function GuestRoute({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect to appropriate dashboard or custom redirect
      const destination =
        redirectTo ||
        (user.role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer");
      router.push(destination);
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (isAuthenticated) {
    return <PageLoading />;
  }

  return <>{children}</>;
}
