import { AppLayout } from "@/layout/common/app-layout";
import { FxManualFunding } from "@/layout/fund-account/fx";
import { LocalManualFunding } from "@/layout/fund-account/local";
import { Tabs } from "@mantine/core";
import { ReactElement } from "react";

export default function FundAccount() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Fund Wallet</h2>
        <span>fund your wallet here</span>
      </div>
      <Tabs
        variant="default"
        defaultValue="local"
        classNames={{ panel: "h-full" }}
      >
        <Tabs.List>
          <Tabs.Tab value="local">Local</Tabs.Tab>
          <Tabs.Tab value="foreign">Foreign</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="local">
          <LocalManualFunding />
        </Tabs.Panel>
        <Tabs.Panel value="foreign">
          <FxManualFunding />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

FundAccount.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
