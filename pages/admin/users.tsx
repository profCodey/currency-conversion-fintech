import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import { Button } from "@mantine/core";
import { ReactElement } from "react";

export default function Rates() {
  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Users"
        subheader="View and manage user details"
        // meta={
        //   <Button className="bg-primary-100 hover:bg-primary-100" size="md">
        //     Create Rate
        //   </Button>
        // }
      />
    </section>
  );
}

Rates.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
