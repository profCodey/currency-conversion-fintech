import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosResponse } from "axios";
import { IAccount, IFxPayout,FxPurpose } from "@/utils/validators/interfaces";

export function useGetFxAccounts() {
  const { data, ...rest } = useQuery({
    queryKey: ["fx", "accounts"],
    queryFn: (): Promise<AxiosResponse<IAccount[]>> =>
      axiosInstance.get("/accounts/"),
  });

  const fxAccounts = data?.data.filter((account) => account.category === "fx");

  return { data, fxAccounts, ...rest };
}
export function useGetFxPurposes() {
  const { data, ...rest } = useQuery({
    queryKey: ["fx", "purposes"],
    queryFn: (): Promise<AxiosResponse<FxPurpose[]>> =>
      axiosInstance.get("/fx/purposes"),
  });

  const fxPurposes = data?.data.map((p) => {
    return {
      id:p.id,
      value:p.description,
      label:p.description,
    }
  }) ?? [];

  return { data, fxPurposes, ...rest };
}


export function useGetFxPayouts() {
  return useQuery({
    queryKey: ["fx", "payouts"],
    queryFn: (): Promise<AxiosResponse<IFxPayout[]>> =>
      axiosInstance.get("/fx/payout/"),
  });
}
// export function usePostFxPayouts() {
//   return useQuery({
//     queryKey: ["fx", "payouts"],
//     queryFn: (): Promise<AxiosResponse<IFxPayout[]>> =>
//       axiosInstance.post("/fx/payout/"),
//   });
// }

export function useGetFxPayoutDetail(id: string) {
  return useQuery({
    queryKey: ["fx", "payout", id],
    queryFn: (): Promise<AxiosResponse<IFxPayout[]>> =>
      axiosInstance.get(`/fx/payout/${id}`),
  });
}
