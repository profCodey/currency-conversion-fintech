import { axiosInstance } from "@/api";
import {
  loginFormValidator,
  signupFormValidator,
  signupPayload,
} from "@/utils/validators";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { APP_TOKENS } from "@/utils/constants";
import { showNotification } from "@mantine/notifications";

export function useRegister() {
  return useMutation({
    mutationFn: function (payload: signupPayload) {
      return axiosInstance().post("/user/register/", payload);
    },
    onSuccess: function (data) {
      console.log({ data });
    },
  });
}
export interface ErrorItem {
  detail?: string;
  code?: string;
}

export function useLogin(
  successCb: (arg0: AxiosResponse) => void,
  errorCb: (arg1: string) => void
) {
  return useMutation({
    mutationFn: function (payload: z.infer<typeof loginFormValidator>) {
      return axiosInstance().post("/login/token/", payload);
    },
    onSuccess: function (data: AxiosResponse) {
      successCb(data);
      const { access, refresh, category } = data.data;
      Cookies.set(APP_TOKENS.ACCESS_TOKEN, access);
      Cookies.set(APP_TOKENS.REFRESH_TOKEN, refresh);
      Cookies.set(APP_TOKENS.CATEGORY, category);
    },
    onError: function (data: AxiosError) {
      const response = data.response?.data as ErrorItem;
      if (response?.detail) {
        return errorCb(response?.detail);
      }
      errorCb("Unable to log you in");
    },
  });
}

export function useGetRefreshToken() {
  const logout = useLogout();
  return useMutation({
    mutationFn: function () {
      return axiosInstance().post("/login/refresh/", {
        refresh: Cookies.get(APP_TOKENS.REFRESH_TOKEN),
      });
    },
    onSuccess: function (data: AxiosResponse) {
      const { access, refresh } = data.data;
      Cookies.set(APP_TOKENS.ACCESS_TOKEN, access);
      Cookies.set(APP_TOKENS.REFRESH_TOKEN, refresh);
    },
    onError: function (data: AxiosError) {
      const response = data.response?.data as ErrorItem;
      showNotification({
        title: "An error occured",
        message: response?.detail || "An application error occured",
      });
      logout();
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return function () {
    Cookies.remove(APP_TOKENS.ACCESS_TOKEN);
    Cookies.remove(APP_TOKENS.REFRESH_TOKEN);
    Cookies.remove(APP_TOKENS.CATEGORY);

    router.push("/login");
  };
}
