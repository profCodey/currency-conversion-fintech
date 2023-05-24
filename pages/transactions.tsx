import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";

export default function Transactions() {
  return (
    <h2 className={"text-primary-100 text-2xl font-secondary"}>Transactions</h2>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
