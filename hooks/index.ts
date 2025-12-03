// Re-export all hooks for easy importing
export {
  useAuth,
  useRequireAuth,
  useRequireRole,
} from "@/contexts/AuthContext";
export {
  useApi,
  useMutation,
  usePagination,
  useDebounce,
  useLocalStorage,
} from "./useApi";
