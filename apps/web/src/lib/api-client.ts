/**
 * PlanLedger Centralized API Client
 * Automatically handles CSRF double-submit cookies, credentials, and uniform error envelopes.
 */

let csrfTokenCache: string | null = null;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

export async function fetchCSRFToken(): Promise<string> {
  const cookieToken = getCookie("csrftoken");
  if (cookieToken) {
    csrfTokenCache = cookieToken;
    return cookieToken;
  }

  try {
    const res = await fetch("/api/v1/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      const token = data.csrfToken || getCookie("csrftoken") || "";
      csrfTokenCache = token;
      return token;
    }
  } catch (err) {
    console.warn("Failed to retrieve CSRF token:", err);
  }
  return "";
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  let url = endpoint;
  if (!url.startsWith("http") && !url.startsWith("/api")) {
    url = `/api/v1${url.startsWith("/") ? "" : "/"}${url}`;
  }

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Attach CSRF token on mutation requests (POST, PUT, PATCH, DELETE)
  const method = (customConfig.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = getCookie("csrftoken") || csrfTokenCache || (await fetchCSRFToken());
    if (token) {
      reqHeaders["X-CSRFToken"] = token;
    }
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: reqHeaders,
    credentials: "include",
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.error?.message || data?.detail || `API Request Failed with status ${response.status}`;
    const error = Object.assign(new Error(errorMessage), {
      status: response.status,
      data,
    });
    throw error;
  }

  return data as T;
}
