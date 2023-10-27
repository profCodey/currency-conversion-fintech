import { AppLayout } from "@/layout/common/app-layout";
import { ExchangeHistory } from "@/layout/transactions/exchange-history";
import { ReactElement } from "react";

export default function Transactions() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Exchange</h2>
        <span>View FX Exchange</span>
        <ExchangeHistory />
      </div>
    </div>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
