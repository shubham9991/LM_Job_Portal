export const BASE_URL = "https://lmap.in/api";
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

export const SCHEDULE_INTERVIEW = (applicationId) =>
  `/school/applications/${applicationId}/schedule`;
export const APPLICATION_INTERVIEW = (applicationId) =>
  `/school/applications/${applicationId}/interview`;
export const ONBOARDING = "/auth/complete-onboarding";
export const USER_PROFILE = "/school/profile";

export const PROFILE_IMAGE_UPLOAD = "/upload/profile-image";

export const STUDENT_JOB_STATUS = (jobId) => `/student/jobs/${jobId}/status`;
export const STUDENT_DASHBOARD = "/student/dashboard";

export const APPLICATION_SHORTLIST = (applicationId) =>
  `/school/applications/${applicationId}/status`;
