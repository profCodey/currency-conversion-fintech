import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { ICurrency } from "@/utils/validators/interfaces";
import { useMemo } from "react";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetCurrencies() {
  return useQuery(["currencies"], function (): Promise<
    AxiosResponse<ICurrency[]>
  > {
    return axiosInstance.get("/currencies/", {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}

export function useCurrencyOptions() {
  const { data, isLoading } = useGetCurrencies();

  const currencyOptions = useMemo(
    function () {
      return (
        data?.data.map((currency) => ({
          label: currency.name,
          value: currency.code,
        })) ?? []
      );
    },
    [data?.data]
  );

  return { isLoading, currencyOptions };
}
