import { axiosInstance } from "@/api";
import { USER_CATEGORIES } from "@/utils/constants";
import {
  IOnboardingDocuments,
  IOnboardingProfile,
  ISelectedGateway,
  User,
} from "@/utils/validators/interfaces";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useUsersList() {
  return useQuery(["users"], function (): Promise<AxiosResponse<User[]>> {
    return axiosInstance.get(
      `/user/list/?category=${USER_CATEGORIES.API_CLIENT}`
    );
  });
}

export function useClientProfileDetails(userId: string) {
  return useQuery(["users", userId], function (): Promise<
    AxiosResponse<IOnboardingProfile>
  > {
    return axiosInstance.get(`/apiclient/onboarding/profile/${userId}`);
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
    return axiosInstance.get(`/local/admin/user-selected-gateways/${userId}/`, {
      baseURL: APICLIENT_BASE_URL,
    });
  });
}
