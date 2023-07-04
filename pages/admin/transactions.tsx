import { PageHeader } from "@/components/admin/page-header";
import {
  Exchange,
  ForeignTransactions,
  Fundings,
  Payouts,
} from "@/layout/admin/transactions";
import { AppLayout } from "@/layout/common/app-layout";
import { Button, Tabs } from "@mantine/core";
import { ReactElement } from "react";

export default function Transactions() {
  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Transactions"
        subheader="View Exchange, Local and Foreign Transactions"
      />

      <section>
        <Tabs defaultValue="payouts" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="payouts">Payouts</Tabs.Tab>
            <Tabs.Tab value="fundings">Fundings</Tabs.Tab>
            <Tabs.Tab value="exchange">Exchange</Tabs.Tab>
            <Tabs.Tab value="fx">Foreign Transactions</Tabs.Tab>
          </Tabs.List>

          <Payouts />
          <Fundings />
          <Exchange />
          <ForeignTransactions />
        </Tabs>
      </section>
    </section>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
