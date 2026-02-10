// API Client with token management and expiration check

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://crm-quest.oneconnectx.com/api/";
const AUTH_TOKEN_KEY = "auth-token";

// Error handler callback - can be set globally
type ErrorHandler = (error: ApiError) => void;
let globalErrorHandler: ErrorHandler | null = null;

export interface ApiError {
  message: string;
  statusCode?: number;
  responseCode?: number;
  isSuccess?: boolean;
}

export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  responseCode: number;
  message: string;
  data?: T;
  token?: string;
  user?: unknown;
}

// Set global error handler
export function setGlobalErrorHandler(handler: ErrorHandler) {
  globalErrorHandler = handler;
}

// Handle API errors centrally
function handleApiError(error: ApiError) {
  if (globalErrorHandler) {
    globalErrorHandler(error);
  } else {
    console.error("API Error:", error);
  }
}

// Decode JWT token to check expiration
function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

// Get token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Set token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

// Remove token from localStorage
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Check if user is authenticated and token is valid
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    removeAuthToken();
    return false;
  }
  return true;
}

// API Client with automatic token attachment
interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const {
    skipAuth = false,
    skipErrorHandler = false,
    ...fetchOptions
  } = options;

  try {
    const token = getAuthToken();

    // Check if token exists and is not expired (except for skipAuth endpoints)
    if (!skipAuth && token && isTokenExpired(token)) {
      removeAuthToken();
      const error: ApiError = {
        message: "Token expired. Please login again.",
        statusCode: 401,
      };
      if (!skipErrorHandler) handleApiError(error);

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw error;
    }

    // Prepare headers - don't set Content-Type for FormData (browser will set it with boundary)
    const isFormData = fetchOptions.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add authorization header if token exists and not skipAuth
    if (token && !skipAuth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Make the request
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    let response: Response;
    try {
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    } catch (fetchError) {
      console.error("Network error:", fetchError);
      const error: ApiError = {
        message:
          fetchError instanceof Error ? fetchError.message : "Network error",
      };
      if (!skipErrorHandler) handleApiError(error);
      throw error;
    }

    // Parse response JSON
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch (jsonError) {
      // JSON parsing error
      const error: ApiError = {
        message: "Invalid response from server",
        statusCode: response.status,
      };
      if (!skipErrorHandler) handleApiError(error);
      throw error;
    }

    // Check if token is invalid (401 Unauthorized)
    if (response.status === 401 && !skipAuth) {
      removeAuthToken();
      const error: ApiError = {
        message: data.message || "Unauthorized. Please login again.",
        statusCode: response.status,
        responseCode: data.responseCode,
        isSuccess: false,
      };
      if (!skipErrorHandler) handleApiError(error);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw error;
    }

    // Handle API-level errors (isSuccess: false)
    if (!data.isSuccess) {
      const error: ApiError = {
        message: data.message || "An error occurred",
        statusCode: response.status,
        responseCode: data.responseCode,
        isSuccess: false,
      };
      if (!skipErrorHandler) handleApiError(error);
      throw error;
    }

    return data;
  } catch (error) {
    // Re-throw ApiError as-is
    if ((error as ApiError).message) {
      throw error;
    }

    // Handle unexpected errors
    const apiError: ApiError = {
      message: "An unexpected error occurred",
    };
    if (!skipErrorHandler) handleApiError(apiError);
    throw apiError;
  }
}

// Helper methods
export const api = {
  get: (endpoint: string, options?: ApiClientOptions) =>
    apiClient(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data?: unknown, options?: ApiClientOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  put: (endpoint: string, data?: unknown, options?: ApiClientOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  patch: (endpoint: string, data?: unknown, options?: ApiClientOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  delete: (endpoint: string, options?: ApiClientOptions) =>
    apiClient(endpoint, { ...options, method: "DELETE" }),
};
