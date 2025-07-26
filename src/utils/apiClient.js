import { BASE_URL } from "./constants";

// Main API client function
export const apiClient = async (url, options = {}, retry = true) => {
  const isFormData = options?.isFormData || false;
  const accessToken = localStorage.getItem("token");

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  try {
    const response = await fetch(BASE_URL + url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");

    if (response.status === 401 && retry) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      let errorText;
      try {
        errorText = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
      } catch {
        errorText = "Unknown error occurred";
      }

      throw new Error(errorText?.message || errorText || "Request failed");
    }

    return contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch (err) {
    console.error("[authFetch Error]", err.message);
    throw err;
  }
};

// ✅ Helper methods with PATCH FORM support
export const api = {
  get: (url) => apiClient(url, { method: "GET" }),
  post: (url, body) => apiClient(url, {
    method: "POST",
    body: JSON.stringify(body),
  }),
  put: (url, body) => apiClient(url, {
    method: "PUT",
    body: JSON.stringify(body),
  }),
  delete: (url) => apiClient(url, { method: "DELETE" }),

  // for file uploads or form-data
  postForm: (url, formData) => apiClient(url, {
    method: "POST",
    body: formData,
    isFormData: true,
  }),

  // ✅ add this for PATCH with form-data (needed for profile update)
  patchForm: (url, formData) => apiClient(url, {
    method: "PATCH",
    body: formData,
    isFormData: true,
  }),
};
