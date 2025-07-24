import { apiClient } from "@/utils/apiClient";
import {
  STUDENT_DASHBOARD,
  STUDENT_JOBS,
  STUDENT_JOB_APPLY,
  STUDENT_CALENDAR,
  STUDENT_PROFILE,
  PUBLIC_JOB_DETAILS,
} from "@/utils/constants";

export const fetchStudentDashboard = async () => {
  return await apiClient(STUDENT_DASHBOARD, { method: "GET" }, false);
};

export const fetchStudentJobs = async () => {
  return await apiClient(STUDENT_JOBS, { method: "GET" }, false);
};

export const applyToStudentJob = async (id, body) => {
  return await apiClient(
    STUDENT_JOB_APPLY(id),
    { method: "POST", body: JSON.stringify(body) },
    false
  );
};

export const fetchStudentCalendar = async () => {
  return await apiClient(STUDENT_CALENDAR, { method: "GET" }, false);
};

export const fetchStudentProfile = async () => {
  return await apiClient(STUDENT_PROFILE, { method: "GET" }, false);
};

export const updateStudentProfile = async (data) => {
  const isFormData = data instanceof FormData;
  return await apiClient(
    STUDENT_PROFILE,
    { method: "PATCH", body: data, isFormData },
    false
  );
};

export const fetchJobDetailsPublic = async (id) => {
  return await apiClient(PUBLIC_JOB_DETAILS(id), { method: "GET" }, false);
};
