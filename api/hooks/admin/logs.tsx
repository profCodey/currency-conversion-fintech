import { axiosInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { ILogEntries } from "@/utils/validators/interfaces";
export function useGetAppLogs() {
  return useQuery(["logs"], function (): Promise<AxiosResponse<ILogEntries>> {
    return axiosInstance.get("/logs");
  });
}
