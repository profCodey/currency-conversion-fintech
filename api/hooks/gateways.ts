import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { queryClient } from "@/pages/_app";
import { AxiosResponse } from "axios";
import { IGateway, ISelectedGateway } from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";

const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

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
