import { useFetchGateways, useGetGateways } from "@/api/hooks/gateways";
import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import { Button, LoadingOverlay, Table } from "@mantine/core";
import { ReactElement, useMemo } from "react";

export default function Gateways() {
  const { data: gateways, isLoading: gatewaysLoading } = useGetGateways();
  const { mutate: fetchGateways, isLoading: fetchGatewaysLoading } =
    useFetchGateways();

  const _rows = useMemo(
    function () {
      return gateways?.data.map(function (gateway, idx) {
        return (
          <tr key={gateway.id}>
            <td>{idx + 1}</td>
            <td>{gateway.id}</td>
            <td>{gateway.description}</td>
          </tr>
        );
      });
    },
    [gateways?.data]
  );

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Gateways"
        subheader="View and fetch available gateways"
        meta={
          <Button
            className="bg-primary-100"
            size="md"
            onClick={fetchGateways}
            loading={fetchGatewaysLoading}
            loaderPosition="right"
          >
            Fetch gateways
          </Button>
        }
      />

      <section>
        <h3 className="font-secondary font-semibold">Gateways</h3>
        <Table
          verticalSpacing="xs"
          withBorder
          className="min-h-[20vh] max-h-[50vh] overflow-y-auto relative"
        >
          <LoadingOverlay visible={gatewaysLoading} />
          <thead>
            <tr className="font-primary font-light">
              <th>S/N</th>
              <th>Gateway ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{_rows}</tbody>
        </Table>
      </section>
    </section>
  );
}

Gateways.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
