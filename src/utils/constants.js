export const BASE_URL = "http://31.97.203.184/api";
/* Auth */
export const AUTH_API_ENDPOINT = "/auth/login";

/* School */
export const DASHBOARD_METRICS = "/school/dashboard-metrics";
export const JOBS_API = "/school/recent-job-postings";
export const CREATE_JOBS = "/school/jobs";
export const JOB_DETAILS = (jobId) => `/school/jobs/${jobId}`;
export const JOB_APPLICANTAS = (jobId) => `/school/jobs/${jobId}/applicants`;
export const APPLICANTAS_DETAILS = (applicantId) =>
  `/school/applicants/${applicantId}`;
export const JOBS_POSTING = "/school/jobs";
export const buildJobsURL = ({
  status = "open",
  category = "",
  limit = 5,
  offset = 0,
  search = "",
} = {}) => {
  const params = new URLSearchParams({
    status,
    category,
    limit: limit.toString(),
    offset: offset.toString(),
    search,
  });

  return `${JOBS_POSTING}?${params.toString()}`;
};
