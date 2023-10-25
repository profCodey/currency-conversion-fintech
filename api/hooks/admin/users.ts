import { axiosInstance } from "@/api";
import { USER_CATEGORIES } from "@/utils/constants";
import {
  IOnboardingDocuments,
  IOnboardingProfile,
  ISelectedGateway,
  User,
} from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorItem } from "../auth";
import { queryClient } from "@/pages/_app";

export function useUsersList() {
  return useQuery(["users"], function (): Promise<AxiosResponse<User[]>> {
    return axiosInstance.get(
      `/user/list/?category=${USER_CATEGORIES.API_CLIENT}`
    );
  });
}

export function useAdminsList() {
  return useQuery(["users", "admin"], function (): Promise<AxiosResponse<User[]>> {
    return axiosInstance.get(
      `/user/list/?category=${USER_CATEGORIES.ADMIN}`
    );
  });
}

export function useClientProfileDetails(userId: string) {
  return useQuery(["users", userId], function (): Promise<
    AxiosResponse<IOnboardingProfile>
  > {
    return axiosInstance.get(`/apiclient/onboarding/profile/${userId}/`);
  });
}

export function useClientDocuments(userId: string) {
  return useQuery(["client-documents", userId], function (): Promise<
    AxiosResponse<IOnboardingDocuments>
  > {
    return axiosInstance.get(`/apiclient/onboarding/document/${userId}/`);
  });
}

export function useClientSelectedGateways(userId: string) {
  return useQuery(["client-gateways", userId], function (): Promise<
    AxiosResponse<ISelectedGateway[]>
  > {
    return axiosInstance.get(`/local/admin/user-selected-gateways/${userId}/`);
  });
}

export function useApproveGateway(cb: () => void) {
  return useMutation(
    ({ status, id }: { id: number; status: string }) => {
      return axiosInstance.patch(
        `/local/selected-gateway/approve/${id}/`,
        {
          status,
        }
      );
    },
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Gateway status changed",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to change gateway status",
          color: "red",
        });
      },
      onSettled: function () {
        cb && cb();
        queryClient.invalidateQueries(["client-gateways"]);
      },
    }
  );
}

interface DocumentApproveReject {
  comment: string;
  status: string;
}
export function useApproveRejectOnboardingDocuments(
  userId: string,
  successCb: () => void
) {
  return useMutation(
    (payload: DocumentApproveReject) => {
      return axiosInstance.patch(
        `/apiclient/onboarding/profile/${userId}/approval/`,
        payload
      );
    },
    {
      onSuccess: function (data: AxiosResponse) {
        showNotification({
          title: "Operation successful",
          message: data?.data.message || "Document approval status updated",
          color: "green",
        });

        successCb();
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          message: response?.detail || "Unable to update document status",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["client-documents", userId]);
      },
    }
  );
}
