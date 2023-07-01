import { axiosInstance } from "@/api";
import { rateFormValidator } from "@/layout/admin/rates/create-rate-button";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { z } from "zod";
import { IRate } from "@/utils/validators/interfaces";

const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetRates() {
  return useQuery(["rates"], function (): Promise<AxiosResponse<IRate[]>> {
    return axiosInstance.get(`/fx/rates/`, {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}

export function useAddNewRate(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof rateFormValidator>) =>
      axiosInstance.post("/fx/rates/", payload, {
        baseURL: APICLIENT_BASE_URL,
      }),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Rate created successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to create rate",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
      },
    }
  );
}
