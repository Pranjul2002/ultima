const API_BASE_URL = "https://ultima-backend-c3fj.onrender.com";
//const API_BASE_URL = "http://localhost:8080";

export const apiClient = async (endpoint, options = {}) => {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include",
  } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { message: text } : {};
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Something went wrong. Please try again.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
