import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ["user", "details"],
    queryFn: () => axiosInstance.get("/user/current-user/"),
  });
}
