import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { IExchange, IExchangeDetailed } from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
import { AxiosError, AxiosResponse } from "axios";
import { ApproveRejectFundingPayload } from "@/layout/transactions/manual-funding-drawer";
import { ErrorItem } from "./auth";
import { APICLIENT_BASE_URL } from "@/utils/constants";

export function useGetExchanges() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: (): Promise<AxiosResponse<IExchangeDetailed[]>> =>
      axiosInstance.get("/fx/exchange/", {
        baseURL: APICLIENT_BASE_URL,
      }),
  });
}

export function useExchange(cb?: () => void) {
  return useMutation(
    function (payload: IExchange) {
      return axiosInstance.post("/fx/exchange/", payload, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Exchange request sent successfully!`,
          color: "green",
        });
      },
      onError: function (error:any) {
      
        if (error.response.data.non_field_errors[0].includes("Insufficient")) {
        // console.log(error.response.data.non_field_errors[0]);
        return showNotification({
          title: "An error occured",
          message: error.response.data.non_field_errors[0],
          color: "red",
        });
      }
        
        return showNotification({
          title: "An error occured",
          message: "Unable to send exchange request",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["exchange"]);
        queryClient.invalidateQueries(["accounts"]);
      },
    }
  );
}

export function useApproveRejectExchange(cb?: () => void) {
  return useMutation(
    function ({ id, ...payload }: ApproveRejectFundingPayload) {
      return axiosInstance.patch(`/fx/exchange/${id}/approve/`, payload, {
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
        queryClient.invalidateQueries(["exchanges"]);
        cb && cb();
      },
    }
  );
}
