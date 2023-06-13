import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ["user", "details"],
    queryFn: () => axiosInstance.get("/user/current-user/"),
  });
}

export function useGetClientDetails(userId: string) {
  return useQuery({
    queryKey: ["client", "details", userId],
    queryFn: () =>
      axiosInstance.get(`/local/client/${userId}/detail/`, {
        baseURL: APICLIENT_BASE_URL,
      }),
    enabled: !!userId,
  });
}
