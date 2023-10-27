import { AppLayout } from "@/layout/common/app-layout";
import { ManualFundingHistory } from "@/layout/transactions/manual-funding";
import { ReactElement } from "react";

export default function Transactions() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Manual Funding</h2>
        <span>View Manual Fnding Histories</span>
        <ManualFundingHistory/>
      </div>
    </div>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
