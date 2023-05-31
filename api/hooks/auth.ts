import { axiosInstance } from "@/api";
import { loginFormValidator, signupFormValidator } from "@/utils/validators";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export function useRegister() {
  return useMutation({
    mutationFn: function (payload: z.infer<typeof signupFormValidator>) {
      return axiosInstance().post("/register", payload);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: function (payload: z.infer<typeof loginFormValidator>) {
      return axiosInstance().post("/login", payload);
    },
  });
}
