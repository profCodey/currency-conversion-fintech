import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IAccount, IFxPayout } from "@/utils/validators/interfaces";
import { APICLIENT_BASE_URL } from "@/utils/constants";

export function useGetFxAccounts() {
  const { data, ...rest } = useQuery({
    queryKey: ["fx", "accounts"],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get("/accounts/", {
        baseURL: APICLIENT_BASE_URL,
      }),
  });

  const fxAccounts = data?.data.filter((account) => account.category === "fx");

  return { data, fxAccounts, ...rest };
}

export function useGetFxPayouts() {
  return useQuery({
    queryKey: ["fx", "payouts"],
    queryFn: (): Promise<AxiosResponse<IFxPayout[]>> =>
      axiosInstance.get("/fx/payout/", {
        baseURL: APICLIENT_BASE_URL,
      }),
  });
}

export function useGetFxPayoutDetail(id: string) {
  return useQuery({
    queryKey: ["fx", "payout", id],
    queryFn: (): Promise<AxiosResponse<IFxPayout[]>> =>
      axiosInstance.get(`/fx/payout/${id}`, {
        baseURL: APICLIENT_BASE_URL,
      }),
  });
}
