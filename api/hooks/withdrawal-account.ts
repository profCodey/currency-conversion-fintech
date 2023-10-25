import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IWithdrawalAccount } from "@/utils/validators/interfaces";

export function useGetWithdrawalAccount(id: string) {
    return useQuery({
      queryKey: ["withdrawal-account", id],
      queryFn: (): Promise<AxiosResponse<IWithdrawalAccount>> =>
        axiosInstance.get(`/withdrawalaccount/${id}/`),
    });
  }
