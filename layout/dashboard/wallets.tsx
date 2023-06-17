import { useGetClientDetails } from "@/api/hooks/user";
import {
  CircleBritishFlag,
  CircleEuropeFlag,
  CircleNigerianFlag,
  CircleUsFlag,
} from "@/components/icons";
import { ActionIcon, Popover, Skeleton } from "@mantine/core";
import { ArrowDown2 } from "iconsax-react";
import { ReactNode } from "react";

export function Wallets({ userId }: { userId: string }) {
  const { data: clientDetails, isLoading: clientDetailsLoading } =
    useGetClientDetails(userId);

  if (clientDetailsLoading) {
    return (
      <WalletsContainer>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </WalletsContainer>
    );
  }

  return (
    <WalletsContainer>
      <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
        <span>£0.00</span>
        <CircleBritishFlag />
      </div>
      <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
        <span>€0.00</span>
        <CircleEuropeFlag />
      </div>
      <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
        <span>$0.00</span>
        <CircleUsFlag />
      </div>
      <div className="px-4 py-3 bg-white flex items-center gap-4 justify-between rounded-md border">
        <span className="mr-auto">
          ₦ {clientDetails?.data.result?.walletBalance ?? "0.00"}
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
                {clientDetails?.data.result?.gatewaybalances.map((gateway) => (
                  <div
                    key={gateway.gatewayId}
                    className="text-gray-90 flex gap-10 justify-between font-normal text-sm"
                  >
                    <span>{gateway.gatewaydescription}</span>
                    <span>₦ {gateway.balance}</span>
                  </div>
                ))}
              </section>
            </Popover.Dropdown>
          </Popover>
        )}
      </div>
    </WalletsContainer>
  );
}

function WalletsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="py-6 px-5 bg-gray-30 rounded-lg border font-semibold flex flex-col gap-4">
      <section className="flex justify-between text-primary-70 text-sm">
        <span>Wallet Balance</span>
        <span>Hide balance</span>
      </section>

      <section className="grid grid-cols-2 grid-rows-[repeat(2,_minmax(4rem,_auto))] gap-4">
        {children}
      </section>
    </div>
  );
}
