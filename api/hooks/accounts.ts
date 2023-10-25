import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IAccount, IVirtualAccount } from "@/utils/validators/interfaces";
import { useCallback, useMemo } from "react";
import { getCurrency } from "@/utils/currency";

export function useGetAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get("/accounts/"),
  });
}

export function useGetVirtualAccount(id: string) {
  return useQuery({
    queryKey: ["virtual-account", id],
    queryFn: (): Promise<AxiosResponse<IVirtualAccount>> =>
      axiosInstance.get(`/local/virtual-account/${id}`),
  });
}
export function useFXWalletAccounts() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get("/site-settings/"),
  });
}

export function useGetClientAccounts(userId: string) {
  return useQuery({
    queryKey: ["accounts", userId],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get(`/accounts/${userId}`),
  });
}

export function useAccountOptions() {
  const { data, ...rest } = useGetAccounts();

  const localAccountOptions = useMemo(
    function () {
      return (
        data?.data
          .filter((account) => account.category === "local")
          .map((account) => ({
            label: `${account.label} (${getCurrency(account.currency.code)})`,
            value: account.id.toString(),
          })) ?? []
      );
    },
    [data?.data]
  );

  const fxAccountOptions = useMemo(
    function () {
      return (
        data?.data
          .filter((account) => account.category === "fx")
          .map((account) => ({
            label: `${account.label} (${getCurrency(account.currency.code)})`,
            value: account.id.toString(),
          })) ?? []
      );
    },
    [data?.data]
  );
  const accountOptions = useMemo(
    function () {
      return (
        data?.data.map((account) => ({
          label: `${account.label} (${getCurrency(account.currency.code)})`,
          value: account.id.toString(),
        })) ?? []
      );
    },
    [data?.data]
  );

  const getAccountCurrency = useCallback(
    function (id: string) {
      const account = data?.data.find(
        (account) => account.id.toString() === id
      );
      return account?.currency;
    },
    [data?.data]
  );

  return {
    accountOptions,
    localAccountOptions,
    fxAccountOptions,
    getAccountCurrency,
    ...rest,
  };
}
