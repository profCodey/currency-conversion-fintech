import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { queryClient } from "@/pages/_app";
import { AxiosResponse } from "axios";
import {
  IGateway,
  IPayoutHistory,
  ISelectedGateway,
  IStatementHistory,
} from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { useMemo } from "react";
import { APICLIENT_BASE_URL } from "@/utils/constants";

export function useGetGateways() {
  return useQuery({
    queryKey: ["apiclient", "gateways"],
    queryFn: function (): Promise<AxiosResponse<Array<IGateway>>> {
      return axiosInstance.get("/local/gateways/", {
        baseURL: APICLIENT_BASE_URL,
      });
    },
  });
}

export function useFetchGateways() {
  return useMutation(
    function (payload: {}) {
      return axiosInstance.post("/local/admin/fetch-gateways/", null, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function (response) {
        showNotification({
          title: "Operation Successful",
          message: response.data.result || `Successfully fetched gateways`,
          color: "green",
        });
      },
      onError: function (error) {
        return showNotification({
          title: "An error occured",
          message: "Unable to fetch gateways",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["apiclient", "gateways"]);
      },
    }
  );
}

export function useGatewayOptions() {
  const { data, isLoading } = useGetGateways();

  const gatewayOptions = useMemo(
    function () {
      return (
        data?.data.map((gateway) => ({
          label: gateway.description,
          value: gateway.id.toString(),
        })) ?? []
      );
    },
    [data?.data]
  );

  return { gatewayOptions, isLoading };
}

export function useEditGateway(gatewayId: number, cb: () => void) {
  return useMutation(
    function (payload: IGateway) {
      return axiosInstance.patch(`/local/gateways/${gatewayId}/`, payload, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Successfully edited gateway`,
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occured",
          message: "Unable to edit gateway",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["apiclient", "gateways"]);
      },
    }
  );
}

export function useGetSelectedGateways() {
  return useQuery({
    queryKey: ["apiclient", "gateways", "selected"],
    queryFn: function (): Promise<AxiosResponse<Array<ISelectedGateway>>> {
      return axiosInstance.get("/local/selected-gateways/", {
        baseURL: APICLIENT_BASE_URL,
      });
    },
  });
}

export function useAddGateway(cb?: () => void) {
  return useMutation(
    function (payload: { gateway: number; is_approved: boolean }) {
      return axiosInstance.post("/local/selected-gateways/", payload, {
        baseURL: APICLIENT_BASE_URL,
      });
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Successfully added gateways`,
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occured",
          message: "Unable to add gateway",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["apiclient", "gateways"]);
      },
    }
  );
}

export function useMakeDefaultGateway(cb?: () => void) {
  return useMutation(
    function (payload: { gateway_id: number; is_default: boolean }) {
      return axiosInstance.patch(
        `/local/selected-gateways/${payload.gateway_id}/`,
        { is_default: payload.is_default },
        {
          baseURL: APICLIENT_BASE_URL,
        }
      );
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Successfully changed default gateway`,
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occured",
          message: "Unable to change default gateway",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["apiclient", "gateways"]);
        cb && cb();
      },
    }
  );
}

export function useDefaultGateway() {
  const { data, isLoading } = useGetSelectedGateways();

  const defaultGateway = useMemo(
    function () {
      return data?.data.find((gateway) => gateway.is_default);
    },
    [data?.data]
  );

  return { isLoading, defaultGateway };
}

interface IPayoutPayload {
  gateway_id: string | null;
  begin_date: string;
  end_date: string;
  user_id?: string;
}

export function useGetStatements(payload: IPayoutPayload) {
  const { gateway_id, begin_date, end_date, user_id } = payload;
  return useQuery({
    queryKey: ["statements", gateway_id, user_id, begin_date, end_date],
    queryFn: function (): Promise<AxiosResponse<IStatementHistory>> {
      return axiosInstance.get(
        `/local/statements/${user_id}/${gateway_id}/${begin_date}/${end_date}/`,
        {
          baseURL: APICLIENT_BASE_URL,
        }
      );
    },
    enabled: !!gateway_id,
  });
}

export function useGetPayouts(payload: IPayoutPayload) {
  const { gateway_id, begin_date, end_date, user_id } = payload;
  return useQuery({
    queryKey: ["payouts", gateway_id, user_id, begin_date, end_date],
    queryFn: function (): Promise<AxiosResponse<IPayoutHistory>> {
      return axiosInstance.get(
        `/local/payouts/${gateway_id}/${user_id}/${begin_date}/${end_date}/`,
        {
          baseURL: APICLIENT_BASE_URL,
        }
      );
    },
    enabled: !!gateway_id,
  });
}

export function useGetAllPayouts(payload: IPayoutPayload) {
  const { gateway_id, begin_date, end_date } = payload;
  return useQuery({
    queryKey: ["payouts", gateway_id, begin_date, end_date],
    queryFn: function (): Promise<AxiosResponse<IPayoutHistory>> {
      return axiosInstance.get(
        `/local/payouts/${gateway_id}/${begin_date}/${end_date}/`,
        {
          baseURL: APICLIENT_BASE_URL,
        }
      );
    },
    enabled: !!gateway_id,
  });
}
