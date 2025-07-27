// src/api/student.js

import { api } from "@/utils/apiClient"; // ✅ Use helper methods

export const jobDetailById = (id) => {
  return api.get(`/jobs/${id}`);
};

export const applyToJob = (jobId, formData) => {
  return api.postForm(`/student/jobs/${jobId}/apply`, formData); // ✅ Use postForm
};

export const getStudentProfile = async () => {
  const res = await api.get("/student/profile");
  return res?.data?.profile;
};

export const getStudentJobs = async () => {
  const res = await api.get("/student/jobs");
  return res?.data;
};

export const checkApplicationStatus = async (jobId) => {
  return api.get(`/student/jobs/${jobId}/status`);
};

export const getStudentDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res?.data;
};


export const updateStudentProfile = async (formData) => {
  return api.patchForm("/student/profile", formData); // PATCH with form-data
};