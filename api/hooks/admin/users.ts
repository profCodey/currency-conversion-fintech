import { axiosInstance } from "@/api";
import { USER_CATEGORIES } from "@/utils/constants";
import { User } from "@/utils/validators/interfaces";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export function useUsersList() {
  return useQuery(["users"], function (): Promise<AxiosResponse<User[]>> {
    return axiosInstance.get(
      `/user/list/?category=${USER_CATEGORIES.API_CLIENT}`
    );
  });
}
