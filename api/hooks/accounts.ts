import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IAccount } from "@/utils/validators/interfaces";
import { useMemo } from "react";
import { getCurrency } from "@/utils/currency";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get("/accounts/", {
        baseURL: APICLIENT_BASE_URL,
      }),
  });
}

export function useGetClientAccounts(userId: string) {
  return useQuery({
    queryKey: ["accounts", userId],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get(`/accounts/${userId}`, {
        baseURL: APICLIENT_BASE_URL,
      }),
  });
}

export function useAccountOptions() {
  const { data, ...rest } = useGetAccounts();

  const accountOptions = useMemo(
    function () {
      return (
        data?.data.map((account) => ({
          label: `${account.label} (${getCurrency(account.currency)})`,
          value: account.id.toString(),
        })) ?? []
      );
    },
    [data?.data]
  );

  return { accountOptions, ...rest };
}
