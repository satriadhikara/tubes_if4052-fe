"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiError } from "@/lib/api/types";

// ============ Types ============

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isValidating: boolean;
}

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  enabled?: boolean;
  refreshInterval?: number;
}

// ============ useApi Hook ============

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData = null,
    onSuccess,
    onError,
    enabled = true,
    refreshInterval,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    error: null,
    isLoading: enabled,
    isValidating: false,
  });

  const fetchData = useCallback(
    async (isValidating = false) => {
      if (!enabled) return;

      setState((prev) => ({
        ...prev,
        isLoading: !isValidating && !prev.data,
        isValidating,
        error: null,
      }));

      try {
        const data = await fetcher();
        setState({
          data,
          error: null,
          isLoading: false,
          isValidating: false,
        });
        onSuccess?.(data);
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(0, "An unknown error occurred");

        setState((prev) => ({
          ...prev,
          error: apiError,
          isLoading: false,
          isValidating: false,
        }));
        onError?.(apiError);
      }
    },
    [fetcher, enabled, onSuccess, onError]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, enabled, fetchData]);

  const mutate = useCallback((newData: T | ((prev: T | null) => T)) => {
    setState((prev) => ({
      ...prev,
      data:
        typeof newData === "function"
          ? (newData as (prev: T | null) => T)(prev.data)
          : newData,
    }));
  }, []);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    ...state,
    mutate,
    refresh,
  };
}

// ============ useMutation Hook ============

interface UseMutationState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: ApiError, variables: V) => void;
  onSettled?: (data: T | null, error: ApiError | null, variables: V) => void;
}

export function useMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
) {
  const { onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const mutate = useCallback(
    async (variables: V) => {
      setState({
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
      });

      try {
        const data = await mutationFn(variables);
        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        onSuccess?.(data, variables);
        onSettled?.(data, null, variables);
        return data;
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(0, "An unknown error occurred");

        setState({
          data: null,
          error: apiError,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        onError?.(apiError, variables);
        onSettled?.(null, apiError, variables);
        throw apiError;
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    mutateAsync: mutate,
    reset,
  };
}

// ============ usePagination Hook ============

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function usePagination(initialLimit: number = 10) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setPagination((prev) => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.limit),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  return {
    ...pagination,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1,
  };
}

// ============ useDebounce Hook ============

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============ useLocalStorage Hook ============

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
