import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetRecipients() {
  return useQuery(["recipients"], function () {
    return axiosInstance.get("/recipients/", {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}
