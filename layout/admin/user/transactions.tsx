import { Tabs } from "@mantine/core";
import { Fundings, Payouts } from "../transactions";
import { UserPayoutHistory } from "@/layout/transactions/payout-history";
import { useRouter } from "next/router";

export function ClientTransactions() {
  const router = useRouter();
  const id = router?.query.id as string;
  return (
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
          <Tabs.Tab value="payouts">Payouts</Tabs.Tab>
          <Tabs.Tab value="fundings">Fundings</Tabs.Tab>
          {/* <Tabs.Tab value="exchange">Exchange</Tabs.Tab>
          <Tabs.Tab value="fx">Foreign Transactions</Tabs.Tab> */}
        </Tabs.List>
        <Tabs.Panel value="payouts" className="flex-grow pt-4">
          <UserPayoutHistory userId={Number(id)} />
        </Tabs.Panel>
        {/* <Payouts /> */}
        <Fundings />
        {/* <Exchange />
        <ForeignTransactions /> */}
      </Tabs>
    </section>
  );
}
