import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { ICurrency } from "@/utils/validators/interfaces";
import { useCallback, useMemo } from "react";
import { APICLIENT_BASE_URL } from "@/utils/constants";
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
import { z } from "zod";
import { currencyFormValidator } from "@/layout/admin/currencies/create-currency-button";
import { editcurrencyFormValidator } from "@/layout/admin/currencies/edit-currency-button";

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

export function useEditNewCurrency(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof editcurrencyFormValidator>) =>
     axiosInstance.patch(`/currencies/${payload.id}/`, payload, {
        baseURL: APICLIENT_BASE_URL,
      }),

    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Currency edited successfully!`,
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occured",
          message: "Unable to edit currency",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["currencies"]);
        cb && cb();
      },
    }
  );
}


export function useAddNewCurrency(cb?: () => void) {
  return useMutation(
    (payload: z.infer<typeof currencyFormValidator>) =>
     axiosInstance.post("/currencies/", payload, {
        baseURL: APICLIENT_BASE_URL,
      }),

    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Currency added successfully!`,
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occured",
          message: "Unable to add currency",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["currencies"]);
        cb && cb();
      },
    }
  );
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

  const allCurrencyOptionsWithId = useMemo(
    function () {
      return (
        data?.data.map((currency) => ({
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
    allCurrencyOptionsWithId,
  };
}
