import { axiosInstance } from "@/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { queryClient  } from "@/pages/_app";
import { ErrorItem } from "../auth";
import { INotification } from "@/utils/validators/interfaces";
export function useGetNotifications() {
  return useQuery(["notifications"], function (): Promise<AxiosResponse<INotification>> {
    return axiosInstance.get("/notifications");
  });
}

export function useDeleteNotification(cb?: () => void) {
  return useMutation(
      (id: number) =>
          axiosInstance.delete(`/notifications/${id}/`, {
          }),
      {
          onSuccess: function (data: AxiosResponse) {
              // showNotification({
              //     title: "Operation successful",
              //     message: "Purpose deleted successfully",
              //     color: "green",
              // });
          },
          onError: function (data: AxiosError) {
              const response = data.response?.data as ErrorItem;
              // showNotification({
              //     message: response?.detail || "Unable to delete Purpose",
              //     color: "red",
              // });
          },
          onSettled: function () {
              cb && cb();
              queryClient.invalidateQueries(["notifications"]);
          },
      }
  );
}