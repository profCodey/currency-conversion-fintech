import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { showNotification } from "@mantine/notifications";
import { queryClient } from "@/pages/_app";
import { addRecipientFormValidator } from "@/utils/validators";
import { z } from "zod";
import { AxiosResponse } from "axios";
import { IRecipient } from "@/utils/validators/interfaces";

export function useGetRecipients() {
  return useQuery(["recipients"], function (): Promise<
    AxiosResponse<IRecipient[]>
  > {
    return axiosInstance.get("/recipients/");
  });
}

export function useAddRecipient(cb?: () => void) {
  return useMutation(
    function (payload: IRecipient) {
      return axiosInstance.post("/recipients/", payload);
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Successfully added recipient`,
          color: "green",
        });
      },
      onError: function () {
        return showNotification({
          title: "An error occured",
          message: "Unable to add recipient",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["recipients"]);
        cb && cb();
      },
    }
  );
}

export function useDeleteRecipient(cb?: () => void) {
  return useMutation(
    function (recipientId: number | undefined) {
      return axiosInstance.delete(`/recipients/${recipientId}`);
    },
    {
      onSuccess: function () {
        showNotification({
          title: "Operation Successful",
          message: `Successfully deleted recipient`,
          color: "green",
        });
      },
      onError: function () {
        showNotification({
          title: "An error occured",
          message: "Unable to delete recipient",
          color: "red",
        });
      },
      onSettled: function () {
        queryClient.invalidateQueries(["recipients"]);
        cb && cb();
      },
    }
  );
}
