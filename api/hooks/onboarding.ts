import { z } from "zod";
import { axiosInstance } from "..";
import { useMutation, useQuery } from "@tanstack/react-query";
import { basicProfileFormValidator } from "@/utils/validators";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { ErrorItem } from "./auth";

export function useGetBasicProfile(userId: string) {
  return useQuery({
    queryKey: ["apiclient", "profile"],
    queryFn: function () {
      return axiosInstance.get(`/apiclient/onboarding/profile/${userId}/`);
    },
  });
}

export function useUpdateBasicProfile(userId: string) {
  return useMutation(
    function (payload: z.infer<typeof basicProfileFormValidator>) {
      return axiosInstance.put(
        `/apiclient/onboarding/profile/${userId}/`,
        payload
      );
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation successful",
          message: "Profile data updated successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          title: "Operation successful",
          message: response.detail || "Unable to update profile",
          color: "red",
        });
      },
    }
  );
}

export function useUpdateOnboardingDocuments(userId: string) {
  return useMutation(
    function (payload: any) {
      return axiosInstance.put(
        `/apiclient/onboarding/document/${userId}/`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation successful",
          message: "Document updated successfully",
          color: "green",
        });
      },
      onError: function (data: AxiosError) {
        const response = data.response?.data as ErrorItem;
        showNotification({
          title: "Operation successful",
          message: response.detail || "Unable to update document",
          color: "red",
        });
      },
    }
  );
}

export function useGetBusinessDocuments(userId: string) {
  return useQuery({
    queryKey: ["apiclient", "documents"],
    queryFn: function () {
      return axiosInstance.get(`/apiclient/onboarding/document/${userId}/`);
    },
  });
}

export function useActivateSubmsub() {
  return useMutation(function () {
    return axiosInstance.post("/user/kyc/token/", {});
  });
}
