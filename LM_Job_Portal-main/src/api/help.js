import { apiClient } from "@/utils/apiClient";
import { HELP_REQUEST, RESOLVE_HELP } from "@/utils/constants";

export const submitHelpRequest = async (body) => {
  return await apiClient(
    HELP_REQUEST,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    false
  );
};

export const fetchOpenHelpRequests = async () => {
  return await apiClient(`${HELP_REQUEST}?status=open`, { method: "GET" }, false);
};

export const resolveHelpRequest = async (id) => {
  return await apiClient(
    RESOLVE_HELP(id),
    { method: "PATCH" },
    false
  );
};
