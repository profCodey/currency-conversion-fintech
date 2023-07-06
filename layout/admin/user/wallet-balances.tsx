import { useGetClientDetails } from "@/api/hooks/user";
import {
  currencyFormatter,
  getCurrency,
  useCurrencyFlags,
} from "@/utils/currency";
import { ActionIcon, Popover, Skeleton } from "@mantine/core";
import { ArrowDown2 } from "iconsax-react";
import { useRouter } from "next/router";

import { CircleNigerianFlag } from "@/components/icons";
import { useGetClientAccounts } from "@/api/hooks/accounts";

export function ClientWalletBalances() {
  const router = useRouter();
  const getIcon = useCurrencyFlags();
  const { data: clientDetails, isLoading: clientDetailsLoading } =
    useGetClientDetails(Number(router?.query.id as string));
  const { isLoading: walletsLoading, data: wallets } = useGetClientAccounts(
    router?.query.id as string
  );

  return (
    <Skeleton
      visible={clientDetailsLoading || walletsLoading}
      className="w-[450px]"
    >
      <section className="w-[450px] h-full bg-white shadow p-6 rounded-md border">
        <h3 className="font-semibold text-gray-90">Wallet Balance</h3>
        <div className="flex flex-col gap-2">
          {wallets?.data
            .filter((wallet) => wallet.category !== "local")
            .map((wallet) => (
              <div
                key={wallet.id}
                className="px-4 py-3 bg-white flex items-center justify-between rounded-md border"
              >
                <span>
                  {getCurrency(wallet.currency)}
                  {currencyFormatter(Number(wallet.balance))}
                </span>
                {getIcon(wallet.currency)}
              </div>
            ))}
          <div className="px-4 py-3 bg-white flex items-center gap-4 justify-between rounded-md border">
            <span className="mr-auto">
              {getCurrency("NGN")}
              {clientDetails?.data.result?.walletBalance
                ? currencyFormatter(clientDetails?.data.result?.walletBalance)
                : "0.00"}
            </span>
            <CircleNigerianFlag />

            {clientDetails?.data.result && (
              <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <ActionIcon>
                    <ArrowDown2 />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <section className="flex flex-col gap-6 p-2">
                    {clientDetails?.data.result?.gatewaybalances.map(
                      (gateway) => (
                        <div
                          key={gateway.gatewayId}
                          className="text-gray-90 flex gap-10 justify-between font-normal text-sm"
                        >
                          <span>{gateway.gatewaydescription}</span>
                          <span>₦ {currencyFormatter(gateway.balance)}</span>
                        </div>
                      )
                    )}
                  </section>
                </Popover.Dropdown>
              </Popover>
            )}
          </div>
        </div>
      </section>
    </Skeleton>
  );
}
