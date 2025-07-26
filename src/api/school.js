import { apiClient } from "@/utils/apiClient";
import {
  ADMIN_CATEGORIES,
  APPLICANTAS_DETAILS,
  APPLICATION_SHORTLIST,
  buildJobsURL,
  CREATE_JOBS,
  DASHBOARD_METRICS,
  JOB_APPLICANTAS,
  JOB_DETAILS,
  JOBS_API,
  ONBOARDING,
  SCHEDULE_INTERVIEW,
  USER_PROFILE,
  // SCHOOL_PROFILE, // Correctly imported and no longer duplicated
} from "@/utils/constants";

export const dashBoardMatrics = async () => {
  const data = await apiClient(
    DASHBOARD_METRICS,
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const jobPostings = async () => {
  const data = await apiClient(
    JOBS_API,
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const createJob = async (body) => {
  const data = await apiClient(
    CREATE_JOBS,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    false
  );
  return data;
};

export const jobDetailById = async (jobId) => {
  const data = await apiClient(
    JOB_DETAILS(jobId),
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const jobApplicants = async (jobId) => {
  const data = await apiClient(
    JOB_APPLICANTAS(jobId),
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const fetchApplicant = async (applicantId) => {
  const data = await apiClient(
    APPLICANTAS_DETAILS(applicantId),
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const schoolJobPostings = async ({
  status = "open",
  category = "",
  limit = 5,
  offset = 0,
  search = "",
} = {}) => {
  const url = buildJobsURL({ status, category, limit, offset, search });

  return await apiClient(url, { method: "GET" }, false);
};

export const fetchCategories = async () => {
  const data = await apiClient(
    ADMIN_CATEGORIES,
    {
      method: "GET",
    },
    false
  );
  return data;
};

export const scheduleInterView = async (applicantId, body) => {
  const data = await apiClient(
    SCHEDULE_INTERVIEW(applicantId),
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    false
  );
  return data;
};

export const shortListApplicant = async (applicantId, body) => {
  const data = await apiClient(
    APPLICATION_SHORTLIST(applicantId),
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    false
  );
  return data;
};

export const fetchSchoolProfile = async () => {
  const data = await apiClient(
    USER_PROFILE,
    {
      method: "GET",
    },
    false
  );
  return data;
};

