
const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7702"
).replace(/\/+$/, "");

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  customHeaders = {}
) {
  const isAuthEndpoint =
    endpoint.startsWith("/api/auth/login") ||
    endpoint.startsWith("/api/auth/signup");

  const token = isAuthEndpoint
    ? null
    : localStorage.getItem("token");

  const config = {
    method: method.toUpperCase(),
    headers: {
      ...(body !== null
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...customHeaders,
    },
  };

  if (body !== null && body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Request failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(
      `[API ${config.method} ${endpoint}] Failed:`,
      error.message
    );

    throw error;
  }
}
