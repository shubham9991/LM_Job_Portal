import { apiClient } from "@/utils/apiClient";
import { DASHBOARD_METRICS } from "@/utils/constants";

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


