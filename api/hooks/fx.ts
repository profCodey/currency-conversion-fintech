import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IAccount } from "@/utils/validators/interfaces";
const APICLIENT_BASE_URL = process.env.NEXT_PUBLIC_APICLIENT_BASE_URL;

export function useGetFxAccounts() {
  return useQuery({
    queryKey: ["fx", "accounts"],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get("/accounts/", {
        baseURL: APICLIENT_BASE_URL,
      }),
  });
}
