import { axiosInstance } from "@/api";
import { purposeFormValidator } from "@/layout/admin/purposes/create-purpose-button";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { z } from "zod";
import { IClientCharges } from "@/utils/validators/interfaces";
import { queryClient } from "@/pages/_app";
import { IRatePayload } from "@/utils/validators/interfaces";
import { UpdatePurposePayload } from "@/pages/admin/purposes";

export function useGetClientCharges() {
  return useQuery(["client-charge"], function (): Promise<
    AxiosResponse<IClientCharges[]>
  > {
    return axiosInstance.get(`/admin/clientcharges/`);
  });
}

export function useAddClientCharge(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof purposeFormValidator>) =>
      axiosInstance.post("/admin/clientcharges/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "New client charge added successfully",
          color: "green",
        });
        cb && cb();
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        if (response.errors && Array.isArray(response.errors)) {
          for (let key of response.errors) {
            console.log("key", key, key.details, key.value);
            showNotification({
              message: `${key.detail}` || "Unable to add client charge",
              color: "red",
            });
          }
        } else {
          showNotification({
            message: "Unable to add client charge",
            color: "red",
          });
        }
      },
      onSettled: function () {
        queryClient.invalidateQueries(["client-charge"]);
      },
    }
  );
}

export function useUpdateClientCharge(cb?: () => void) {
  return useMutation(
    function ({ id, ...payload }: UpdatePurposePayload) {
      return axiosInstance.patch(`/admin/clientcharges/${id}/`, payload, {});
    },
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Client charge updated successfully",
          color: "green",
        });
        cb && cb();
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        if (response.errors && Array.isArray(response.errors)) {
          for (let key of response.errors) {
            console.log("key", key, key.details, key.value);
            showNotification({
              message: `${key.detail}` || "Unable to add client charge",
              color: "red",
            });
          }
        } else {
          showNotification({
            message: "Unable to add client charge",
            color: "red",
          });
        }
      },
      onSettled: function () {
        queryClient.invalidateQueries(["client-charge"]);
      },
    }
  );
}
