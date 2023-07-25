import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosError, AxiosResponse } from "axios";
import {
  IClientDetail,
  ICurrentUser,
  ISupport,
} from "@/utils/validators/interfaces";
import { useMemo } from "react";
import { z } from "zod";
import { supportFormValidator } from "@/pages/support";
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

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

export function useGetSupportRequests() {
  return useQuery({
    queryKey: ["support-requests"],
    queryFn: function (): Promise<AxiosResponse<ISupport[]>> {
      return axiosInstance.get("/supports/", {
        baseURL: APICLIENT_BASE_URL,
      });
    },
  });
}

export function useSendSupportRequest(successCb: () => void) {
  return useMutation(
    (payload: z.infer<typeof supportFormValidator>) =>
      axiosInstance.post("/supports/", payload, {
        baseURL: APICLIENT_BASE_URL,
      }),
    {
      onSuccess: function (response: AxiosResponse) {
        showNotification({
          title: "Your support request has been received",
          message:
            "We will attend to it, and get back to you as soon as we can, thank you.",
          color: "green",
        });
        successCb();
      },
      onError: function (error: AxiosError) {
        showNotification({
          title: "Error occured",
          message: "Please try again later",
          color: "red",
        });
      },
    }
  );
}

export function useCloseSupportRequest(successCb: () => void) {
  return useMutation(
    (payload: ISupport) =>
      axiosInstance.patch(
        `/supports/${payload.id}`,
        { is_closed: true },
        {
          baseURL: APICLIENT_BASE_URL,
        }
      ),
    {
      onSuccess: function (response: AxiosResponse) {
        showNotification({
          title: "Request Closed",
          message: "Support request successfully closed",
          color: "green",
        });
        successCb();
      },
      onError: function (error: AxiosError) {
        showNotification({
          title: "Error occured",
          message: "Please try again later",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["support-requests"]);
      },
    }
  );
}
