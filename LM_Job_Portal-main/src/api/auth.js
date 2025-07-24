import { apiClient } from "@/utils/apiClient";
import {
  AUTH_API_ENDPOINT,
  ONBOARDING,
  PROFILE_IMAGE_UPLOAD,
  CERTIFICATE_UPLOAD,
  USER_PROFILE,
} from "@/utils/constants";

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

export const getUserProfile = async () => {
  const data = await apiClient(
    USER_PROFILE,
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient(PROFILE_IMAGE_UPLOAD, {
    method: "POST",
    body: formData,
    isFormData: true,
  });

  return response;
};

export const uploadCertificate = async (file) => {
  const formData = new FormData();
  formData.append("certificate", file);

  return await apiClient(CERTIFICATE_UPLOAD, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const authOnboarding = async (formData) => {
  return await apiClient(
    ONBOARDING,
    {
      method: "POST",
      body: formData,
      isFormData: true,
    },
    false
  );
};

