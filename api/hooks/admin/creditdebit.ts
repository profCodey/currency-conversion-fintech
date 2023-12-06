import { ICreditDebit } from '@/utils/validators/interfaces';
import { queryClient } from '@/pages/_app';
import { axiosInstance } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";
import { z } from "zod";
import { showNotification } from "@mantine/notifications";
import { ApproveRejectCreditDebitPayload } from '@/layout/transactions/manual-funding-drawer';
export interface ErrorItem {
    detail?: string;
    code?: string;
  }
  
export function useAddCreditDebit(cb?: () => void) {
  return useMutation(
    (payload: any) =>
      axiosInstance.post("/local/admin/manualtransaction/", payload, {
      }),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Manual transaction created successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to create Manual transaction",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["credit-debit"]);
        cb && cb();
      },
    }
  );
}
// export function useGetCreditDebit()
export function useUpdateCreditDebitStatus(cb?: () => void) {
  return useMutation(
    ({ id, ...payload }: ApproveRejectCreditDebitPayload) =>
    axiosInstance.post(`/local/admin/manualtransaction/${id}/approve-reject/`, payload, {
      
      }),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message:
            data?.data.message || "status updated successfully",
            color: "green",
          });
        },
        onError: function (data: AxiosError) {
          const response = data.response?.data as ErrorItem;
          showNotification({
            message: response?.detail || "Unable to update status",
            color: "red",
          });
        },
        onSettled: function () {
          queryClient.invalidateQueries(["credit-debit"]);
          cb && cb();
        },
        });
      }
  
      export function useGetCreditDebit(userId: string) {
        return useQuery(["credit-debit", userId], function (): Promise<
          AxiosResponse<ICreditDebit[]>
        > {
          {console.log("userId", userId)}
          return axiosInstance.get(`/local/admin/manualtransaction/?client_id=${userId}`, {
            
          });
        });
      }