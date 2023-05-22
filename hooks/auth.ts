import { axiosInstance } from "@/api";
import { AxiosResponse } from "axios";
import { loginFormValidator } from "@/pages/login";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export function useLogin() {
  return useMutation({
    mutationFn: function (
      data: z.infer<typeof loginFormValidator>
    ): Promise<AxiosResponse> {
      return axiosInstance.post("/", data);
    },
  });
}

