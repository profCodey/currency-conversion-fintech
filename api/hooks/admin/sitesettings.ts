import { axiosInstance } from "@/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { ISiteSettings } from "@/utils/validators/interfaces";
// import { z } from zod;
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
import { useMemo } from "react";


export interface ErrorItem {
    detail?: string;
    code?: string;
    }

export function useGetSiteSettings() {
    return useQuery(["site-settings"],
         function (): Promise<AxiosResponse<ISiteSettings>> {
            return axiosInstance.get("/site-settings/");
        },
    );
}

export function useUpdateSiteSettings(cb?: () => void) {
    return useMutation(
        function (data: ISiteSettings): Promise<AxiosResponse<ISiteSettings>> {
            return axiosInstance.patch("/site-settings/update/", data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        },
        {
            onSuccess: function (data) {
                showNotification({
                    title: "Success",
                    message: "Site settings updated successfully",
                    color: "blue",
                });
                queryClient.setQueryData(["site-settings"], data.data);
            },
            onError: function (error: AxiosError<ErrorItem>) {
                showNotification({
                    title: "Error",
                    message: error.response?.data.detail || "Something went wrong",
                    color: "red",
                });
            },
            onSettled: function () {
                cb && cb();
                queryClient.invalidateQueries(["site-settings"]);
              },
        },
    );
}
