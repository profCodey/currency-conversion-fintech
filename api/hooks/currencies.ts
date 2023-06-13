import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetCurrencies() {
  return useQuery(["currencies"], function () {
    return axiosInstance.get("/currencies/", {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}
