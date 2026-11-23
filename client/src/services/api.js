const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL 


/**
 * Reusable Fetch API helper
 * @param {string} endpoint - API path (e.g., '/users')
 * @param {string} method - HTTP method ('GET', 'POST', 'PUT', 'DELETE')
 * @param {object|null} body - Input payload for POST/PUT requests
 * @param {object} customHeaders - Optional extra headers (e.g., Auth tokens)
 * @returns {Promise<any>} - Parsed JSON output
 */
export async function apiRequest(endpoint, method = 'GET', body = null, customHeaders = {}) {
  // Ensure base URL exists to avoid fetching undefined paths
  if (!BASE_URL) {
    throw new Error('API Base URL is not defined in environment variables.');
  }

  const url = `${BASE_URL}${endpoint}`;

  const config = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  };

  // Attach input payload only for methods that support a request body
  if (body && config.method !== 'GET' && config.method !== 'HEAD') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Handle HTTP errors (4xx, 5xx)
    if (!response.ok) {
      let errorDetails = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch {
        // Fallback if the error response is not valid JSON (e.g., HTML 404 page)
      }
      throw new Error(errorDetails);
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Parse and return JSON output
    return await response.json();
  } catch (error) {
    // Catches both network failures and thrown HTTP errors
    console.error(`[API ${config.method} ${endpoint}] Failed:`, error.message);
    throw error;
  }
}

export async function healthCheck() {
    const status = await apiRequest('/api/health','GET',null)
    console.log(status)
}