import { axiosInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

import { ILog } from "@/utils/validators/interfaces";
export function useGetAppLogs() {
  return useQuery(["logs"], function (): Promise<AxiosResponse<ILog[]>> {
    return axiosInstance.get("/logs", {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}
