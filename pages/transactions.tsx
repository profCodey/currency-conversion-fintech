import { useDefaultGateway } from "@/api/hooks/gateways";
import { useGetCurrentUser } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
import { FxPayoutHistory } from "@/layout/transactions/fx-payout-history";
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

      <Tabs defaultValue="local-payouts">
        <Tabs.List>
          <Tabs.Tab value="local-payouts">Local Payouts</Tabs.Tab>
          <Tabs.Tab value="fx-payouts">Fx Payouts</Tabs.Tab>
          <Tabs.Tab value="manual-funding">Manual Funding</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="local-payouts" className="py-2">
          <UserPayoutHistory
            userId={data!.data.id}
            gateway={String(defaultGateway?.gateway)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="fx-payouts" className="py-2">
          <FxPayoutHistory />
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
