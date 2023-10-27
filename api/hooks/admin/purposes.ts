import { axiosInstance } from "@/api";
import { purposeFormValidator } from "@/layout/admin/purposes/create-purpose-button";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { z } from "zod";
import { IPurpose } from "@/utils/validators/interfaces";
import { queryClient } from "@/pages/_app";
import { IRatePayload } from "@/utils/validators/interfaces";
import { UpdatePurposePayload } from "@/pages/admin/purposes";


export function useGetPurposes() {
  return useQuery(["purposes"], function (): Promise<AxiosResponse<IPurpose[]>> {
    return axiosInstance.get(`/fx/purposes/`);
  });
}

export function useAddNewPurpose(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof purposeFormValidator>) =>
      axiosInstance.post("/fx/purposes/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Purpose created successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to create purpose",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["purposes"]);
      },
    }
  );
}

export function useDeletePurpose(cb?: () => void) {
  return useMutation(
      (id: number) =>
          axiosInstance.delete(`/fx/purposes/${id}/`, {
          }),
      {
          onSuccess: function (data: AxiosResponse) {
              showNotification({
                  title: "Operation successful",
                  message: "Purpose deleted successfully",
                  color: "green",
              });
          },
          onError: function (data: AxiosError) {
              const response = data.response?.data as ErrorItem;
              showNotification({
                  message: response?.detail || "Unable to delete Purpose",
                  color: "red",
              });
          },
          onSettled: function () {
              cb && cb();
              queryClient.invalidateQueries(["purposes"]);
          },
      }
  );
}

export function useUpdatePurpose(cb?: () => void) {
  return useMutation(
      
          function ({ id, ...payload }: UpdatePurposePayload) {
              return axiosInstance.put(`/fx/purposes/${id}/`, payload, {
              });
            },
      {
          onSuccess: function (data: AxiosResponse) {
              showNotification({
                  title: "Operation successful",
                  message: data?.data.message || "Purpose updated successfully",
                  color: "green",
              });
          },
          onError: function (data: AxiosError) {
              const response = data.response?.data as ErrorItem;
              showNotification({
                  message: response?.detail || "Unable to update purpose",
                  color: "red",
              });
          },
          onSettled: function () {
              cb && cb();
              queryClient.invalidateQueries(["purposes"]);
          },
      }
  );
}