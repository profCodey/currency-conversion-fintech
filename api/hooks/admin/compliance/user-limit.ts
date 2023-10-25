import { axiosInstance } from "@/api";
import { queryClient } from "@/pages/_app";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import { IGlobalList } from "@/utils/validators/interfaces";
import { globalListFormValidator } from "@/layout/admin/compliance/create-user-limit-button";
import { ErrorItem } from "../../auth";

export function useGetUserLimit() {
  return useQuery({
    queryKey: ["userList"],
    queryFn: (): Promise<AxiosResponse<IGlobalList[]>> =>
      axiosInstance.get(`/compliance/user-limit/`),
  });
}

export function useGetUserLimitById(payload: number) {
  // console.log("payload", payload);

  return useQuery({
    queryKey: ["userList"],
    queryFn: (): Promise<AxiosResponse<IGlobalList[]>> =>
      axiosInstance.get(`/compliance/user-limit/${payload}`),
  });
}

export function usePutUserList(params: number, cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof globalListFormValidator>) =>
      axiosInstance.put(
        `/compliance/user-limit/${params}/`,
        {
          ...payload,
          currency: Number(payload.currency),
        }
      ),

    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `User List updated successfully!`,
          color: "green",
        });
      },
      onError: function (error) {
        // console.log("errror", error);

        return showNotification({
          title: "An error occured",
          message: "Unable to update user list",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["userList"]);
        cb && cb();
      },
    }
  );
}

export function useAddNewUserList(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof globalListFormValidator>) =>
      axiosInstance.post("/compliance/user-limit/", payload),

    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `User List added successfully!`,
          color: "green",
        });
      },
      onError: function (error) {
        // console.log("errror", error);

        return showNotification({
          title: "An error occured",
          message: "Unable to add user list",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["userList"]);
        cb && cb();
      },
    }
  );
}

export function useDeleteUserLimitById(cb?: () => void) {
  return useMutation(
    (id: number) =>
      axiosInstance.delete(`/compliance/user-limit/${id}`),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: "User List deleted successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to delete User List",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["userList"]);
      },
    }
  );
}
