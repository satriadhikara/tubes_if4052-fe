"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  Vendor,
  LoginRequest,
  RegisterRequest,
  ApiError,
} from "@/lib/api/types";
import { authApi, tokenStorage, vendorsApi } from "@/lib/api";

// ============ Types ============

interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// ============ Context ============

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============ Provider ============

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    vendor: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = tokenStorage.get();

    if (!token) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
      return;
    }

    try {
      const user = await authApi.me();

      // If user is vendor, try fetch vendor profile
      let vendor: Vendor | null = null;
      if (user.role === "vendor") {
        try {
          vendor = await vendorsApi.getMe();
        } catch {
          vendor = null;
        }
      }

      setState({
        user,
        vendor,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      // Token invalid or expired
      tokenStorage.remove();
      setState({
        user: null,
        vendor: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const login = useCallback(async (data: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login(data);
      tokenStorage.set(response.token);

      let vendor: Vendor | null = response.vendor || null;
      if (!vendor && response.user.role === "vendor") {
        try {
          vendor = await vendorsApi.getMe();
        } catch {
          vendor = null;
        }
      }

      setState({
        user: response.user,
        vendor,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Login gagal. Silakan coba lagi.";

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.register(data);
      tokenStorage.set(response.token);

      let vendor: Vendor | null = response.vendor || null;
      if (!vendor && response.user.role === "vendor") {
        try {
          vendor = await vendorsApi.getMe();
        } catch {
          vendor = null;
        }
      }

      setState({
        user: response.user,
        vendor,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Registrasi gagal. Silakan coba lagi.";

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      tokenStorage.remove();
      setState({
        user: null,
        vendor: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const refreshUser = useCallback(async () => {
    await checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============ Hook ============

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// ============ Auth Guard Hook ============

export function useRequireAuth(redirectTo: string = "/auth") {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store intended destination
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth_redirect", window.location.pathname);
      }
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading, user };
}

// ============ Role Guard Hook ============

export function useRequireRole(
  allowedRoles: ("customer" | "vendor" | "admin")[],
  redirectTo: string = "/"
) {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        window.location.href = redirectTo;
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, redirectTo]);

  return {
    user,
    isLoading,
    hasAccess: user ? allowedRoles.includes(user.role) : false,
  };
}
