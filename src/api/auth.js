import { apiClient } from "@/utils/apiClient";
import { AUTH_API_ENDPOINT } from "@/utils/constants";
export const AuthAPI = async (email, password) => {
  const data = await apiClient(
    AUTH_API_ENDPOINT,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false
  );
  return data;
};

