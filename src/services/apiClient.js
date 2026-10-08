const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiClient(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra từ Backend");
  }

  return data;
}
