import { queryClient } from "@/pages/_app";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { axiosInstance } from "@/api";
import { ApproveRejectFundingPayload } from "@/layout/transactions/manual-funding-drawer";
import { IManualPayment } from "@/utils/validators/interfaces";

const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useApproveRejectFunding(cb?: () => void) {
  return useMutation(
    function ({ id, ...payload }: ApproveRejectFundingPayload) {
      return axiosInstance.patch(`/manual-funding/${id}/approve/`, payload, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function (data: AxiosResponse) {
        if (data?.data.status) {
          showNotification({
            title: "Operation successful",
            message: "Your request has been sent",
            color: "green",
          });
        } else
          showNotification({
            message: data?.data.message,
            color: "red",
          });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Request failed",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["manual-fundings"]);
        cb && cb();
      },
    }
  );
}

export function useGetClientManualFundings(userId: string) {
  return useQuery({
    queryKey: ["manual-fundings", userId],
    queryFn: function (): Promise<AxiosResponse<IManualPayment[]>> {
      return axiosInstance.get(`/manual-funding/user/${userId}`, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
  });
}
