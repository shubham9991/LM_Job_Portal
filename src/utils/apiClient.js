import { BASE_URL } from "./constants";

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

    // Handle expired token retry
    if (response.status === 401 && retry) {
      try {
        // Optional: refresh token logic here if needed
        localStorage.clear();
        window.location.href = "/login";
        return;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
    }

    if (!response.ok) {
      // Attempt to parse error message or return raw text
      let errorText;
      try {
        errorText = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
      } catch {
        errorText = "Unknown error occurred";
      }

      throw new Error(
        errorText?.message || errorText || "Request failed"
      );
    }

    // Parse response
// Parse response
if (contentType?.includes("application/json")) {
  const json = await response.json();
  return json;
} else if (response.ok) {
  return await response.text(); // might be success message
} else {
  throw new Error("Server returned unexpected content");
}

  } catch (err) {
    console.error("[authFetch Error]", err.message);
    throw err;
  }
};
