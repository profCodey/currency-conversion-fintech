import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IClientDetail } from "@/utils/validators/interfaces";
import { useMemo } from "react";
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
    queryFn: (): Promise<AxiosResponse<IClientDetail>> =>
      axiosInstance.get(`/local/client/${userId}/detail/`, {
        baseURL: APICLIENT_BASE_URL,
      }),
    enabled: !!userId,
  });
}

export function useIsVerified() {
  const { data, isLoading } = useGetCurrentUser();
  const { data: clientDetails, isLoading: clientDetailsLoading } =
    useGetClientDetails(data?.data.id);

  const isVerified = useMemo(
    function () {
      return clientDetails?.data.status;
    },
    [clientDetails?.data]
  );

  return {
    isLoading: isLoading || clientDetailsLoading,
    isVerified,
  };
}
