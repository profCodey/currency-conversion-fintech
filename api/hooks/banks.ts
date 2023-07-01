import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosError, AxiosResponse } from "axios";
import {
  IBank,
  IManualPayment,
  INameEnquiry,
  IPaycelerAccount,
} from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { ErrorItem } from "./auth";
import { fundManualAccount } from "@/utils/validators";
import { z } from "zod";
import { queryClient } from "@/pages/_app";
import { useCallback, useMemo } from "react";

const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;
export function useGetBanks() {
  return useQuery(["banks"], function (): Promise<AxiosResponse<IBank[]>> {
    return axiosInstance.get(`/banks/?category=local&is_active=true`, {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}

export function useBankOptions() {
  const { data: banks, isLoading } = useGetBanks();
  const bankOptions = useMemo(
    function () {
      return (
        banks?.data.map((bank) => ({
          label: bank.name,
          value: bank.id.toString(),
        })) ?? []
      );
    },
    [banks?.data]
  );

  const getBankName = useCallback(
    function (id: number) {
      return banks?.data.find((bank) => bank.id === id);
    },
    [banks?.data]
  );

  return { bankOptions, getBankName, isLoading };
}

export function useNameEnquiry(
  payload: {
    account_number: string;
    bank_code: string;
    gateway_id: string;
  } | null
) {
  return useQuery(
    [
      "name-enquiry",
      payload?.account_number,
      payload?.bank_code,
      payload?.gateway_id,
    ],
    function (): Promise<AxiosResponse<INameEnquiry>> {
      return axiosInstance.get(
        `/local/name-enquiry/${payload?.gateway_id}/${payload?.bank_code}/${payload?.account_number}/`,
        {
          baseURL: APICLIENT_BASE_URL,
        }
      );
    },
    {
      enabled: payload !== null,
    }
  );
}

interface LocalPayout {
  gateway: number;
  amount: number;
  account_number: string;
  bank: string;
  narration: string;
}
export function useCreatePayout(cb?: () => void) {
  return useMutation(
    function (payload: LocalPayout) {
      return axiosInstance.post("/local/payouts/create/", payload, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function (data: AxiosResponse) {
        if (data?.data.status) {

          

          showNotification({
            message: "Operation successful",
            color: "green",
          });
        } else
          showNotification({
            message: data?.data.message,
            color: "red",
          });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Registration unsuccessful",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
      },
    }
  );
}

/**** MANUAL FUNDINGS */
export function useGetPaycelerBankDetails() {
  return useQuery({
    queryKey: ["payceler-banks"],
    queryFn: function (): Promise<AxiosResponse<IPaycelerAccount[]>> {
      return axiosInstance.get(`/payceler_accounts/`, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
  });
}

export function useGetManualFundings() {
  return useQuery({
    queryKey: ["manual-fundings"],
    queryFn: function (): Promise<AxiosResponse<IManualPayment[]>> {
      return axiosInstance.get(`/local/manual-funding/`, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
  });
}

export function usePostManualFunding(cb?: () => void) {
  return useMutation(
    function (payload: z.infer<typeof fundManualAccount>) {
      return axiosInstance.post("/local/manual-funding/", payload, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function (data: AxiosResponse) {
        if (data?.data.status) {
          showNotification({
            title: "Operation successful",
            message:
              "Please wait, while we confirm and fund the selected gateway",
            color: "green",
          });
        } else
          showNotification({
            message: data?.data.message,
            color: "red",
          });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Registration unsuccessful",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["manual-fundings"]);
        cb && cb();
      },
    }
  );
}
