import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { IExchange, IExchangeDetailed } from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
import { AxiosError, AxiosResponse } from "axios";
import { ApproveRejectFundingPayload } from "@/layout/transactions/manual-funding-drawer";
import { ErrorItem } from "./auth";

export function useGetExchanges() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: (): Promise<AxiosResponse<IExchangeDetailed[]>> =>
      axiosInstance.get("/fx/exchange/"),
  });
}

export function useExchange(cb?: () => void) {
  return useMutation(
    function (payload: IExchange) {
      return axiosInstance.post("/fx/exchange/", payload);
      
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
//         let errorShown = error.response.data.errors;
// console.log('errorShown', errorShown);

//         let errors = errorShown.map((value: { attr: string; detail: string; code:string })=> {
//           return showNotification({
//             title: "An error occured",
//             message: `${value.attr} ${value.detail}}`,
//             color: "red",
//           });
//         })
// console.log('errorrrs', errors);

//         return errors;



let errorShown = error.response?.data?.errors;


if (Array.isArray(errorShown)) {
  let errors = errorShown.map((value: { attr: string; code: string; detail: string }) => {
    return showNotification({
      title: "An error occurred",
      message: `${value.attr}: ${value.detail}`,
      color: "red",
    });
  });
  return errors;
} else {
  return showNotification({
    title: "An error occurred",
    message:  "Request failed",
    color: "red",
  });
}

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
      return axiosInstance.patch(`/fx/exchange/${id}/approve/`, payload);
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
