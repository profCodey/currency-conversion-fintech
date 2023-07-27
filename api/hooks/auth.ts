import { axiosInstance } from "@/api";
import { loginFormValidator, signupPayload } from "@/utils/validators";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { APP_TOKENS, USER_CATEGORIES } from "@/utils/constants";
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
import { LoginResponse } from "@/utils/validators/interfaces";

export function useRegister() {
  const { mutate: login } = useLogin();
  return useMutation({
    mutationFn: function (payload: signupPayload) {
      return axiosInstance.post("/user/register/", payload);
    },
    onSuccess: function (_, variables) {
      showNotification({
        message: "Registration successful",
        color: "green",
      });
      login({
        email: variables.email,
        password: variables.password,
      });
    },
    onError: function (data: AxiosError) {
      const response = data.response?.data as ErrorItem;
      showNotification({
        message: response?.detail || "Registration unsuccessful",
        color: "red",
      });
    },
  });
}
export interface ErrorItem {
  detail?: string;
  code?: string;
}

export function useLogin() {
  const router = useRouter();
  const logout = useLogout();

  function handleLoginSuccess(data: AxiosResponse<LoginResponse>) {
    showNotification({
      title: "Login successful",
      message: "Signing you in",
      color: "green",
    });

    switch (data.data.category) {
      case USER_CATEGORIES.API_CLIENT:
        if (data.data.is_approved) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
        return;
      case USER_CATEGORIES.ADMIN:
        router.push("/admin");
        return;
      default:
        logout();
        break;
    }
  }

  return useMutation({
    mutationFn: function (payload: z.infer<typeof loginFormValidator>) {
      return axiosInstance.post("/login/token/", payload);
    },
    onSuccess: function (data: AxiosResponse) {
      const { access, refresh, category } = data.data;
      Cookies.set(APP_TOKENS.ACCESS_TOKEN, access);
      Cookies.set(APP_TOKENS.REFRESH_TOKEN, refresh);
      Cookies.set(APP_TOKENS.CATEGORY, category);
      handleLoginSuccess(data);
    },
    onError: function (data: AxiosError) {
      const response = data.response?.data as ErrorItem;
      const message = response?.detail || "Unable to log you in";

      return showNotification({
        title: "An error occured",
        message,
        color: "red",
      });
    },
  });
}

export function useGetRefreshToken() {
  const logout = useLogout();
  return useMutation({
    mutationFn: function () {
      return axiosInstance.post("/login/refresh/", {
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
    queryClient.clear();
    router.push("/login");
  };
}
