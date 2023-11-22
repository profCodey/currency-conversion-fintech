import { AppLayout } from "@/layout/common/app-layout";
import { FxPayoutHistory } from "@/layout/transactions/fx-payout-history";
import { ReactElement } from "react";
import Cookies from "js-cookie";

export default function Transactions() {
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  return (
    <div className="flex flex-col gap-6 h-full">
      <div style={{ color: colorPrimary }}>
        <h2 className={"text-2xl font-secondary mt-2"}>Payouts</h2>
        <span>View FX Payouts</span>
        <FxPayoutHistory />
      </div>
        </div>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
