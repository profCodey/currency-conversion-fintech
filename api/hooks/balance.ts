import { useCallback } from "react";
import { useGetAccounts } from "./accounts";
import { useDefaultGateway } from "./gateways";
import { useGetClientDetails, useGetCurrentUser } from "./user";

export function useLocalBalance() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: clientDetails, isLoading } = useGetClientDetails(
    currentUser?.data.id
  );
  const { defaultGateway, isLoading: defaultGatewayLoading } =
    useDefaultGateway();

  const gateway = clientDetails?.data.result?.gatewaybalances.find(
    (gateway) => gateway.gatewayId === defaultGateway?.gateway_reference
  );

  return {
    defaultGatewayBalance: gateway?.balance || 0,
    isLoading: isLoading || defaultGatewayLoading,
  };
}

export function useFxBalance() {
  const { data, ...rest } = useGetAccounts();

  const getBalanceFromCurrency = useCallback(
    function (currency: string) {
      const account = data?.data.find(
        (account) => String(account.currency.id) === currency
      );
      return account;
    },
    [data?.data]
  );

  return { data, getBalanceFromCurrency, ...rest };
}
