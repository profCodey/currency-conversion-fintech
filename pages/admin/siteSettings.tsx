import { AppLayout } from "@/layout/common/app-layout";
import { SiteSettingsInitiate } from "@/layout/admin/siteSettings";
import { ReactElement } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs } from "@mantine/core";


export default function SiteSettings() {
    return (
        <section className="flex flex-col gap-6 h-full">
        <PageHeader
          header="Site Settings"
          subheader="View and update site settings"
          />
          <section className="flex-grow">
          <SiteSettingsInitiate/>
          </section>
          </section>
    )
}

SiteSettings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
}