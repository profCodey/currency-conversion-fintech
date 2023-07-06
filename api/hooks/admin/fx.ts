import { axiosInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetFxSummary() {
  return useQuery(["fx", "summary"], function (): Promise<
    AxiosResponse<{ pending: number; approved: 0 }>
  > {
    return axiosInstance.get(`/fx/exchange/summary`, {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}
