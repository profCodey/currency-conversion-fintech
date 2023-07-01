import { ManualFundingHistory } from "@/layout/transactions/manual-funding";
import { Tabs } from "@mantine/core";

export function Fundings() {
  return (
    <Tabs.Panel value="fundings">
      <ManualFundingHistory />
    </Tabs.Panel>
  );
}
