import { useDefaultGateway } from "@/api/hooks/gateways";
import { useGetCurrentUser } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
import { ExchangeHistory } from "@/layout/transactions/exchange-history";
import { FxPayoutHistory } from "@/layout/transactions/fx-payout-history";
// import { TransactionHistory } from "@/layout/dashboard";
import { ManualFundingHistory } from "@/layout/transactions/manual-funding";
import { UserPayoutHistory } from "@/layout/transactions/payout-history";
import { Statements } from "@/layout/transactions/statements";
import { Tabs } from "@mantine/core";
import { ReactElement } from "react";

export default function Transactions() {
  const { data } = useGetCurrentUser();
  const { defaultGateway, isLoading } = useDefaultGateway();
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Transactions</h2>
        <span>View Transaction History</span>
        <UserPayoutHistory
            userId={data!.data.id}
            gateway={String(defaultGateway?.gateway)}
          />
      </div>
    </div>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
