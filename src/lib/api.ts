/**
 * API utility for making authenticated requests with JWT tokens
 */

import { API_BASE_URL } from "./config";

const TOKEN_KEY = "authToken";

/**
 * Get the stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store the JWT token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the stored JWT token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * Make an authenticated API request
 * Automatically includes JWT token in Authorization header
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  
  // Preserve Content-Type if it's already set (e.g., for FormData)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token expiration
  if (response.status === 401) {
    removeToken();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPicture");
    
    // Redirect to auth page
    if (window.location.pathname !== "/auth") {
      window.location.href = "/auth?expired=true";
    }
    
    throw new Error("Authentication expired. Please log in again.");
  }

  return response;
};

/**
 * Make an authenticated GET request
 */
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: "GET" });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.message || "Request failed");
  }
  
  return response.json();
};

/**
 * Make an authenticated POST request
 */
export const apiPost = async <T = any>(
  endpoint: string,
  body?: any
): Promise<T> => {
  const options: RequestInit = {
    method: "POST",
  };

  if (body instanceof FormData) {
    options.body = body;
  } else if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await apiRequest(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.message || "Request failed");
  }
  
  return response.json();
};

/**
 * Make an authenticated PATCH request
 */
export const apiPatch = async <T = any>(
  endpoint: string,
  body?: any
): Promise<T> => {
  const options: RequestInit = {
    method: "PATCH",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await apiRequest(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.message || "Request failed");
  }
  
  return response.json();
};

/**
 * Make an authenticated DELETE request
 */
export const apiDelete = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: "DELETE" });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.message || "Request failed");
  }
  
  return response.json();
};
