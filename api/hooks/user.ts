import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IClientDetail, ICurrentUser } from "@/utils/validators/interfaces";
import { useMemo } from "react";
import { APICLIENT_BASE_URL } from "@/utils/constants";

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ["user", "details"],
    queryFn: (): Promise<AxiosResponse<ICurrentUser>> =>
      axiosInstance.get("/user/current-user/"),
  });
}

export function useGetClientDetails(userId: number | undefined) {
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

export function useRole() {
  const { data, ...rest } = useGetCurrentUser();
  const role = useMemo(
    function () {
      return data?.data.category;
    },
    [data?.data]
  );

  return { role, ...rest };
}
