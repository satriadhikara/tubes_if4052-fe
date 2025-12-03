import { ApiError, ApiResponse } from "./types";

// ============ Configuration ============

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ============ Token Management ============

const TOKEN_KEY = "wisudahub_token";

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

// ============ Request Helpers ============

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errors: Record<string, string[]> | undefined;

    if (isJson) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errors = errorData.errors;
      } catch {
        // Ignore JSON parse errors
      }
    }

    throw new ApiError(response.status, errorMessage, errors);
  }

  if (!isJson) {
    return {} as T;
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success && data.error) {
    throw new ApiError(response.status, data.error, data.errors);
  }

  return data.data as T;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, timeout = REQUEST_TIMEOUT, ...fetchConfig } = config;

  const url = buildUrl(endpoint, params);
  const token = tokenStorage.get();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchConfig.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      signal: controller.signal,
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new ApiError(408, "Request timeout");
      }
      throw new ApiError(0, error.message);
    }

    throw new ApiError(0, "An unknown error occurred");
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============ HTTP Methods ============

export const api = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ) => request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

// ============ File Upload Helper ============

export async function uploadFile(
  endpoint: string,
  file: File,
  fieldName: string = "file"
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const token = tokenStorage.get();
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  return handleResponse<{ url: string }>(response);
}

export default api;
