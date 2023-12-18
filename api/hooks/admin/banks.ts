import { axiosInstance } from "@/api";
import { AddNewBankValidator } from "@/layout/admin/banks/add-bank";
import { MapBankValidator } from "@/layout/admin/banks/map-bank";
import { queryClient } from "@/pages/_app";
import { IBank, INewBank } from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";
import { z } from "zod";

export interface ErrorItem {
  detail?: string;
  code?: string;
}

export function useAddNewBank(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof AddNewBankValidator>) =>
      axiosInstance.post("/banks/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Bank created successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to create bank",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["banks"]);
        cb && cb();
      },
    }
  );
}

export function useDeactivateBank(cb?: () => void) {
  return useMutation(
    ({ id, ...payload }: any) =>
      axiosInstance.patch(`/banks/${id}/`, payload),
    {
      onSuccess: function (data: AxiosResponse, variables) {
        showNotification({
          title: "Operation successful",
          message:
            data?.data.message || variables.is_active
              ? "Bank activated successfully"
              : "Bank de-activated successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to change bank status",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["banks"]);
      },
    }
  );
}

export function useGetBanks() {
  return useQuery(["banks"], function (): Promise<AxiosResponse<IBank[]>> {
    return axiosInstance.get(`/banks/`);
  });
}

export function useBankOptions() {
  const { data, isLoading } = useGetBanks();
console.log("data", data);

  const bankOptions = useMemo(
    function () {
      return (
        data?.data.map((bank) => ({
          label: bank?.bankName,
          value: bank?.id?.toString(),
        })) ?? []
      );
    },
    [data?.data]
  );

  return { bankOptions, isLoading };
}

export function useMapNewBank(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof MapBankValidator>) =>
      axiosInstance.post("/local/admin/bank-mapping/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Bank mapped successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to create bank mapping",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
      },
    }
  );
}
