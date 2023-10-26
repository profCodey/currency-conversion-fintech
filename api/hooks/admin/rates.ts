import { axiosInstance } from "@/api";
import { rateFormValidator } from "@/layout/admin/rates/create-rate-button";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { z } from "zod";
import { IRate } from "@/utils/validators/interfaces";
import { queryClient } from "@/pages/_app";
import { IRatePayload } from "@/utils/validators/interfaces";
import { UpdateRatePayload } from "@/pages/admin/rates";


export function useGetRates() {
  return useQuery(["rates"], function (): Promise<AxiosResponse<IRate[]>> {
    return axiosInstance.get(`/fx/rates/`);
  });
}

export function useAddNewRate(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof rateFormValidator>) =>
      axiosInstance.post("/fx/rates/", payload),
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
        queryClient.invalidateQueries(["rates"]);
      },
    }
  );
}

export function useGetLiveRate(payload: IRatePayload) {
  return useQuery(['liveRate', payload.source, payload.destination], async () => {
    // if(!payload.source || !payload.destination) return;
    const response = await axiosInstance.get('/fx/rates/liverate', {
      params: {
        source_currency: payload.source,
        destination_currency: payload.destination,
      },
    });

    const rate = response.data;

    return rate;
  });
}

export function useDeleteRate(cb?: () => void) {
  return useMutation(
      (id: number) =>
          axiosInstance.delete(`/fx/rates/${id}/`, {
          }),
      {
          onSuccess: function (data: AxiosResponse) {
              showNotification({
                  title: "Operation successful",
                  message: "Rate deleted successfully",
                  color: "green",
              });
          },
          onError: function (data: AxiosError) {
              const response = data.response?.data as ErrorItem;
              showNotification({
                  message: response?.detail || "Unable to delete Rate",
                  color: "red",
              });
          },
          onSettled: function () {
              cb && cb();
              queryClient.invalidateQueries(["rates"]);
          },
      }
  );
}

export function useUpdateRate(cb?: () => void) {
  return useMutation(
      
          function ({ id, ...payload }: UpdateRatePayload) {
              return axiosInstance.patch(`/fx/rates/${id}/`, payload, {
              });
            },
      {
          onSuccess: function (data: AxiosResponse) {
              showNotification({
                  title: "Operation successful",
                  message: data?.data.message || "Rate updated successfully",
                  color: "green",
              });
          },
          onError: function (data: AxiosError) {
              const response = data.response?.data as ErrorItem;
              showNotification({
                  message: response?.detail || "Unable to update rate",
                  color: "red",
              });
          },
          onSettled: function () {
              cb && cb();
              queryClient.invalidateQueries(["rates"]);
          },
      }
  );
}