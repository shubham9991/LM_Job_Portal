import { apiClient } from "@/utils/apiClient";
import { DASHBOARD_METRICS, JOBS_API } from "@/utils/constants";

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


