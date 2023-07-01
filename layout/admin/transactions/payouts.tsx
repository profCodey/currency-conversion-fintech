import {
  TransactionHistory as PayoutsHistory,
} from "@/layout/transactions/transaction-history";
import { Tabs } from "@mantine/core";

export function Payouts() {
  return (
    <Tabs.Panel value="payouts">
      <PayoutsHistory />
    </Tabs.Panel>
  );
}
