export const BASE_URL = "http://31.97.203.184/api";
/* Auth */
export const AUTH_API_ENDPOINT = "/auth/login";
/* School */
export const DASHBOARD_METRICS = "/school/dashboard-metrics";
export const JOBS_API = "/school/recent-job-postings";
export const CREATE_JOBS = "/school/jobs";
export const ADMIN_CATEGORIES = "/admin/categories";

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

export const SCHEDULE_INTERVIEW = (applicantId) =>
  `/school/applications/${applicantId}/schedule`;
export const ONBOARDING = "/auth/complete-onboarding";
export const USER_PROFILE = "/school/profile";

export const PROFILE_IMAGE_UPLOAD = "/upload/profile-image";

export const APPLICATION_SHORTLIST = (applicantId) =>
  `/school/applications/${applicantId}/status`;
