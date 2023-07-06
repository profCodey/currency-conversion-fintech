import { useDefaultGateway } from "@/api/hooks/gateways";
import { useGetCurrentUser } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
// import { TransactionHistory } from "@/layout/dashboard";
import { ManualFundingHistory } from "@/layout/transactions/manual-funding";
import { UserPayoutHistory } from "@/layout/transactions/payout-history";
import { Tabs } from "@mantine/core";
import { ReactElement } from "react";

export default function Transactions() {
  const { data } = useGetCurrentUser();
  const { defaultGateway, isLoading } = useDefaultGateway();
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Transactions</h2>
        <span>View Different Transaction Histories</span>
      </div>

      <Tabs defaultValue="payouts">
        <Tabs.List>
          <Tabs.Tab value="payouts">Payouts</Tabs.Tab>
          <Tabs.Tab value="manual-funding">Manual Funding</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="payouts" className="py-2">
          <UserPayoutHistory
            userId={data!.data.id}
            gateway={String(defaultGateway?.gateway)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="manual-funding" className="py-2">
          <ManualFundingHistory />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
