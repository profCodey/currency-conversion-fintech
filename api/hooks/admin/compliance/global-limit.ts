import { axiosInstance } from "@/api";
import { queryClient } from "@/pages/_app";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import { IGlobalList } from "@/utils/validators/interfaces";
import { globalListFormValidator } from "@/layout/admin/compliance/create-global-limit-button";
import { ErrorItem } from "../../auth";

export function useGetGlobalLimit() {
  return useQuery({
    queryKey: ["globalList"],
    queryFn: (): Promise<AxiosResponse<IGlobalList[]>> =>
      axiosInstance.get(`/compliance/global-limit/`),
  });
}

export function useGetGlobalLimitById(payload: number) {
  // console.log("payload", payload);

  return useQuery({
    queryKey: ["globalList"],
    queryFn: (): Promise<AxiosResponse<IGlobalList[]>> =>
      axiosInstance.get(`/compliance/global-limit/${payload}`),
  });
}

export function usePutGlobalList(params: number, cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof globalListFormValidator>) =>
      axiosInstance.put(
        `/compliance/global-limit/${params}/`,
        {
          ...payload,
          currency: Number(payload.currency),
        }
      ),

    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Global List updated successfully!`,
          color: "green",
        });
      },
      onError: function (error) {
        // console.log("errror", error);

        return showNotification({
          title: "An error occured",
          message: "Unable to update global list",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["globalList"]);
        cb && cb();
      },
    }
  );
}

export function useAddNewGlobalList(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof globalListFormValidator>) =>
      axiosInstance.post("/compliance/global-limit/", payload),

    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Global List added successfully!`,
          color: "green",
        });
      },
      onError: function (error) {
        // console.log("errror", error);

        return showNotification({
          title: "An error occured",
          message: "Unable to add global list",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["globalList"]);
        cb && cb();
      },
    }
  );
}

export function useDeleteGlobalLimitById(cb?: () => void) {
  return useMutation(
    (id: number) =>
      axiosInstance.delete(`/compliance/global-limit/${id}`),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: "Global List deleted successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to delete Global List",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["global-list"]);
      },
    }
  );
}
