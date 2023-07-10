import { PageHeader } from "@/components/admin/page-header";
import {
  Exchange,
  Fundings,
  Payouts,
} from "@/layout/admin/transactions";
import { AppLayout } from "@/layout/common/app-layout";
import { FxPayoutHistory } from "@/layout/transactions/fx-payout-history";
import { Tabs } from "@mantine/core";
import { ReactElement } from "react";

export default function Transactions() {
  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Transactions"
        subheader="View Exchange, Local and Foreign Transactions"
      />

      <section className="flex-grow">
        <Tabs
          defaultValue="payouts"
          variant="pills"
          className="h-full"
          classNames={{
            panel: "flex-grow",
            tabsList: "shrink-0",
            root: "flex flex-col",
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="payouts">Local Payouts</Tabs.Tab>
            <Tabs.Tab value="fx-payouts">Foreign Payouts</Tabs.Tab>
            <Tabs.Tab value="fundings">Fundings</Tabs.Tab>
            <Tabs.Tab value="exchange">Exchange</Tabs.Tab>
            {/* <Tabs.Tab value="fx">Foreign Transactions</Tabs.Tab> */}
          </Tabs.List>
          <Tabs.Panel value="fx-payouts" className="pt-5">
            <FxPayoutHistory />
          </Tabs.Panel>
          <Payouts />
          <Fundings />
          <Exchange />
          {/* <ForeignTransactions /> */}
        </Tabs>
      </section>
    </section>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
