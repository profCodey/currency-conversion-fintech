import { useGetSupportRequests } from "@/api/hooks/user";
import { PageHeader } from "@/components/admin/page-header";
import { SupportDrawer } from "@/layout/admin/support/drawer";
import { AppLayout } from "@/layout/common/app-layout";
import { ISupport } from "@/utils/validators/interfaces";
import { Button, ScrollArea, Skeleton, Table } from "@mantine/core";
import dayjs from "dayjs";
import { ReactElement, useMemo, useState } from "react";

export default function Support() {
  const [supportData, setSupportData] = useState<ISupport | null>(null);

  const { data, isLoading } = useGetSupportRequests();

  const rows = useMemo(
    function () {
      return data?.data.map((support, idx) => (
        <tr key={support.id}>
          <td>{idx + 1}</td>
          <td>{dayjs(support.created_on).format("MMMM D, YYYY h:mm A")}</td>
          <td>{support.full_name}</td>
          <td>{support.business_name}</td>
          <td>{support.email}</td>
          <td>
            {support.is_closed ? (
              <span className="text-accent">Closed</span>
            ) : (
              <span className="text-gray-90">Open</span>
            )}
          </td>
          <td>
            <Button
              variant="white"
              className="px-0 text-accent my-auto"
              onClick={() => setSupportData(support)}
            >
              Open
            </Button>
          </td>
        </tr>
      ));
    },
    [data?.data]
  );
  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Support"
        subheader="Attend to support requests from users"
      />
      <Skeleton visible={isLoading} className="flex-grow">
        <section className="flex-grow h-full">
          <ScrollArea type="scroll">
            <Table withBorder verticalSpacing="lg" className="flex-grow">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Date created</th>
                  <th>Full name</th>
                  <th>Business name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </section>
      </Skeleton>

      <SupportDrawer
        closeDrawer={() => setSupportData(null)}
        supportData={supportData}
      />
    </section>
  );
}

Support.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
