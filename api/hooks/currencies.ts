import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { ICurrency } from "@/utils/validators/interfaces";
import { useCallback, useMemo } from "react";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetCurrencies() {
  const { data, ...rest } = useQuery(["currencies"], function (): Promise<
    AxiosResponse<ICurrency[]>
  > {
    return axiosInstance.get("/currencies/", {
      baseURL: APICLIENT_BASE_URL,
    });
  });

  const getCurrencyCodeFromId = useCallback(
    (code: number) => {
      return data?.data.find((currency) => currency.id === code)?.code;
    },
    [data?.data]
  );

  return { data, getCurrencyCodeFromId, ...rest };
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

  const currencyOptionsWithId = useMemo(
    function () {
      return (
        data?.data
          .filter((currency) => currency.code !== "NGN")
          .map((currency) => ({
            label: currency.name,
            value: currency.id.toString(),
          })) ?? []
      );
    },
    [data?.data]
  );

  // function getCurrency

  function getCurrencyNameFromId(id: number) {
    const currency = data?.data.find((currency) => currency.id === id);
    return currency?.name || "Currency not found";
  }

  return {
    isLoading,
    currencyOptions,
    currencyOptionsWithId,
    getCurrencyNameFromId,
  };
}
