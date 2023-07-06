import { Tabs } from "@mantine/core";
import { UserManualFundingHistory } from "../user/manual-fundings";
import { ManualFundingHistory } from "@/layout/transactions/manual-funding";

export function Fundings() {
  return (
    <Tabs.Panel value="fundings">
      <ManualFundingHistory />
      {/* <UserManualFundingHistory /> */}
    </Tabs.Panel>
  );
}
