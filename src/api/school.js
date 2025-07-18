import { apiClient } from "@/utils/apiClient";
import {
  APPLICANTAS_DETAILS,
  CREATE_JOBS,
  DASHBOARD_METRICS,
  JOB_APPLICANTAS,
  JOB_DETAILS,
  JOBS_API,
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
