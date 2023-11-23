import { AppLayout } from "@/layout/common/app-layout";
import { FxManualFunding } from "@/layout/fund-account/fx";
import { LocalManualFunding } from "@/layout/fund-account/local";
import { Tabs } from "@mantine/core";
import { ReactElement } from "react";
import Cookies from "js-cookie";

export default function FundAccount() {
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
    let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
    let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  return (
    <div className="flex flex-col gap-6 h-full">
      <div style={{ color: colorPrimary }}>
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
