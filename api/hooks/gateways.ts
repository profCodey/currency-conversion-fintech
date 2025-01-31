import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { useClientSelectedGateways } from "@/api/hooks/admin/users";
import { useRouter } from "next/router";
import { queryClient } from "@/pages/_app";
import axios, { AxiosResponse } from "axios";
import {
  IGateway,
  IPayoutHistory,
  ISelectedGateway,
  IStatementHistory,
} from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { useMemo } from "react";
import { useGetCurrentUser } from "./user";
import { USER_CATEGORIES } from "@/utils/constants";


export function useGetGateways() {
  return useQuery({
    queryKey: ["apiclient", "gateways"],
    queryFn: function (): Promise<AxiosResponse<Array<IGateway>>> {
      return axiosInstance.get("/local/gateways/");
    },
  });
}


export function useClientSelectedGatewayOptions() {
  const router = useRouter();
  const { data, isLoading } = useClientSelectedGateways(router?.query.id as string);
  const gatewayOptions = useMemo(
    function () {
      return (
        data?.data.map((gateway) => ({
          label: gateway.gateway_name,
          value: gateway.id.toString(),
        })) ?? []
      );
    },
    [data?.data]
  );
  return { gatewayOptions, isLoading };
}
export function useFetchGateways() {
  return useMutation(
    function (payload: {}) {
      return axiosInstance.post("/local/admin/fetch-gateways/", null);
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


export function useCreateVirtualAccount() {
  return useMutation(
    function (selected_gateway_id: string) {
      const payload = { selected_gateway_id };
      return axiosInstance.post(`local/virtual-account/generate/${selected_gateway_id}/`, payload);
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation successful",
          message: "Request for a virtual account sent successfully",
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occurred",
          message: "Unable to request a virtual account",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["apiclient", "gateways"]);
      },
    }
  );
}


export function useCreateNewGateway(cb1: () => void, cb2: () => void) {
  return useMutation(
    function (payload:{ gateway: number; user: number; }) {
      return axiosInstance.post("/local/mapgateway-to-client/", payload);
    },
    {
      onSuccess: function () {
        cb2 && cb2();
        showNotification({
          title: "Operation Successful",
          message: `Successfully created gateway`,
          color: "green",
        });
      },
      onError: function () {
        cb1 && cb1();
        return showNotification({
          title: "An error occured",
          message: "Unable to create gateway",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["apiclient", "gateways"]);
      },
    }
  );
}

export function useDynamicCreateVirtualAccount(cb: () => void) {
  return useMutation(
    function (payload:any) {
      return axiosInstance.post(`local/virtual-account/generate/`, payload);
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation successful",
          message: "Request for a virtual account sent successfully",
          color: "green",
        });
        cb && cb();
      },
      onError: function (error: any) {
        console.log("error", error)
        const errorShown = (error.response?.data?.errors) as Array<{ attr: string; code: string; detail: string }>;
        errorShown.map((value: { attr: string; code: string; detail: string }) => {
        return showNotification({
          title: "Unable to request a virtual account",
          message: `${value.attr}: ${value.detail}`,
          color: "red",
        });
      });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["apiclient", "gateways"]);
      },
    }
  );
}

export function useGetVirtualAccountDetails(gatewayId: string) {
  return useQuery(["virtual-account", gatewayId], function (): Promise<AxiosResponse> {
    return axiosInstance.post(
      `/local/virtual-account/template/${gatewayId}/`
    );
  });
}

export function useEditGateway(gatewayId: number, cb: () => void) {
  return useMutation(
    function (payload: IGateway) {
      return axiosInstance.patch(`/local/gateways/${gatewayId}/`, payload);
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
  const { isLoading, data } = useGetCurrentUser();
  const isApiClient = data?.data.category === USER_CATEGORIES.API_CLIENT;
  return useQuery({
    queryKey: ["apiclient", "gateways", "selected"],
    queryFn: function (): Promise<AxiosResponse<Array<ISelectedGateway>>> {
      
      if (isApiClient) {

        return axiosInstance.get("/local/selected-gateways/");
      }
       
      },
    });
}

// Update the function signature
export function useAddGateway(onSuccessCallback?: () => void) {
  return useMutation(
    function (payload: { gateway: number; is_approved?: boolean }) {
      return axiosInstance.post("/local/selected-gateways/", payload);
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Request successfully sent. You will be notified as soon as it is approved.`,
          color: "green",
        });

        // Call the onSuccessCallback if provided
        onSuccessCallback?.();
      },
      onError: function (error: any) {
        let errorShown = error.response?.data?.errors;
        if (Array.isArray(errorShown)) {
          errorShown.forEach((value: { attr: string; code: string; detail: string }) => {
            showNotification({
              title: "An error occurred",
              message: `${value.attr}: ${value.detail}`,
              color: "red",
            });
          });
        } else {
          showNotification({
            title: "An error occurred",
            message: "Unable to add gateway",
            color: "red",
          });
        }
      },
      onSettled: function () {
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
        { is_default: payload.is_default }
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
        `/local/statements/${user_id}/${gateway_id}/${begin_date}/${end_date}/`
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
        `/local/payouts/${gateway_id}/${user_id}/${begin_date}/${end_date}/`
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
        `/local/payouts/${gateway_id}/${begin_date}/${end_date}/`
      );
    },
    enabled: !!gateway_id,
  });
}