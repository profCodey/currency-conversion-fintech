import { ExchangeHistory } from "@/layout/transactions/exchange-history";
import { Tabs } from "@mantine/core";

export function Exchange() {
  return (
    <Tabs.Panel value="exchange" className="py-2">
      <ExchangeHistory />
    </Tabs.Panel>
  );
}
