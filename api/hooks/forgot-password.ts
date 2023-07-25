import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { showNotification } from "@mantine/notifications";
import { AxiosError, AxiosResponse } from "axios";

export function useResetPassword() {
  return useMutation(
    (payload: { email: string }) =>
      axiosInstance.post("/user/reset-password/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        console.log(data);
        showNotification({
          title: "Request sent!",
          message: data?.data.success,
          color: "green",
        });
      },
      onError: function (error: AxiosError) {
        console.log(error);
        const errors = error.response?.data as Record<string, string>;

        // Object.values(errors).forEach((error: Record<string, string>) => {
          
        // });

        showNotification({
          title: "An error occured",
          message: "Unable to send instructions, please try later",
          color: "red",
        });
      },
    }
  );
}
