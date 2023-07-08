import { useGetAppLogs } from "@/api/hooks/admin/logs";
import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import { Skeleton, Table } from "@mantine/core";
import { ReactElement, useMemo } from "react";

export default function Logs() {
  const { data, isLoading } = useGetAppLogs();

  const rows = useMemo(
    function () {
      return data?.data.map((log, idx) => (
        <tr key={log.id}>
          <td>{idx + 1}</td>
          <td>{log.created_on}</td>
          <td>{log.message}</td>
          <td>{log.created_by_name}</td>
          <td>{log.updated_by_name}</td>
        </tr>
      ));
    },
    [data?.data]
  );
  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader header="Logs" subheader="View a report of all transactions" />
      <Skeleton visible={isLoading} className="flex-grow">
        <section className="flex-grow h-full">
          <Table withBorder className="h-full flex-grow">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Date created</th>
                <th>Message</th>
                <th>Created by</th>
                <th>Updated by</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </section>
      </Skeleton>
    </section>
  );
}

Logs.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
