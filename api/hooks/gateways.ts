import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";

export function useGetGateways() {
  return useQuery({
    queryKey: ["apiclient", "gateways"],
    queryFn: function () {
      return axiosInstance.get("/local/gateways/", {
        baseURL: process.env.NEXT_PUBLIC_APICLIENT_BASE_URL,
      });
    },
  });
}
