import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { showNotification } from "@mantine/notifications";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import { forgotPasswordValidator } from "@/pages/forgot-password";

export function useResetPassword(cb: () => void) {
  return useMutation(
    (payload: { email: string }) =>
      axiosInstance.post("/auth/reset-password/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Request sent!",
          message: data?.data.success,
          color: "green",
        });

        cb();
      },
      onError: function (error: AxiosError) {
        console.log(error);
        const errors = error.response?.data as Record<string, string>;

        showNotification({
          title: "An error occured",
          message: "Unable to send instructions, please try later",
          color: "red",
        });
      },
    }
  );
}

export function useSetNewPassword(successCb: () => void) {
  return useMutation(
    (payload: z.infer<typeof forgotPasswordValidator>) =>
      axiosInstance.post("/auth/reset-password/change/", payload),
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Password reset successful!",
          message: data?.data.success,
          color: "green",
        });

        successCb();
      },
      onError: function (error: AxiosError) {
        // console.log(error);
        // const errors = error.response?.data as Record<string, string>;
        const errorData = error.response?.data as { success: string };
        showNotification({
          title: "An error occured",
          message: errorData.success || "Unable to reset password",
          color: "red",
        });
      },
    }
  );
}
