import { axiosInstance } from "@/api";
import { ApproveRejectFundingPayload } from "@/layout/transactions/manual-funding-drawer";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { queryClient } from "@/pages/_app";
import { APICLIENT_BASE_URL } from "@/utils/constants";

export function useGetFxSummary() {
  return useQuery(["fx", "summary"], function (): Promise<
    AxiosResponse<{ pending: number; approved: 0 }>
  > {
    return axiosInstance.get(`/fx/exchange/summary`, {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}

export function useApproveRejectFxPayout(cb?: () => void) {
  return useMutation(
    function ({ id, ...payload }: ApproveRejectFundingPayload) {
      return axiosInstance.patch(`/fx/payout/${id}/approve/`, payload, {
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
        queryClient.invalidateQueries(["fx", "payouts"]);
        cb && cb();
      },
    }
  );
}
