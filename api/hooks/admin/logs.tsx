import { axiosInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { ILogEntries } from "@/utils/validators/interfaces";
import { APICLIENT_BASE_URL } from "@/utils/constants";
export function useGetAppLogs() {
  return useQuery(["logs"], function (): Promise<AxiosResponse<ILogEntries>> {
    return axiosInstance.get("/logs", {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}
