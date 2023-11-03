import { useFetchGateways, useGetGateways } from "@/api/hooks/gateways";
import { PageHeader } from "@/components/admin/page-header";
import { GatewayEditModal } from "@/layout/admin/gateway";
import { AppLayout } from "@/layout/common/app-layout";
import { IGateway } from "@/utils/validators/interfaces";
import { Button, LoadingOverlay, Modal, Table } from "@mantine/core";
import { data } from "autoprefixer";
import { ReactElement, useMemo, useState } from "react";

export default function Gateways() {
    const { data: gateways, isLoading: gatewaysLoading } = useGetGateways();
    const { mutate: fetchGateways, isLoading: fetchGatewaysLoading } =
        useFetchGateways();

    const [currentGateway, setCurrentGateway] = useState<IGateway | null>(null);

    const _rows = useMemo(
        function () {
            return gateways?.data.map(function (gateway, idx) {
                return (
                    <tr key={gateway.id}>
                        <td>{gateway.id}</td>
                        <td>{gateway.label}</td>
                        <td>{gateway.is_active ? "true" : "false"}</td>
                        <td>{gateway.is_private ? "true" : "false"}</td>
                        <td>
                            <Button
                                size="sm"
                                className="bg-primary-100"
                                onClick={() => setCurrentGateway(gateway)}>
                                Edit
                            </Button>
                        </td>
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
                        loaderPosition="right">
                        Fetch gateways
                    </Button>
                }
            />

            <section>
                <h3 className="font-secondary font-semibold">Gateways</h3>
                <Table
                    verticalSpacing="xs"
                    withBorder
                    className="min-h-[20vh] max-h-[50vh] overflow-y-auto relative">
                    <LoadingOverlay visible={gatewaysLoading} />
                    <thead>
                        <tr className="font-primary font-light">
                            <th>Gateway ID</th>
                            <th>Name</th>
                            <th>Is_Active</th>
                            <th>Is_Private</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{_rows}</tbody>
                </Table>
            </section>

            <Modal
                title="Edit gateway details"
                onClose={() => setCurrentGateway(null)}
                opened={!!currentGateway}>
                {!!currentGateway && (
                    <GatewayEditModal
                        formValues={currentGateway}
                        closeModal={() => setCurrentGateway(null)}
                    />
                )}
            </Modal>
        </section>
    );
}

Gateways.getLayout = function getLayout(page: ReactElement) {
    return <AppLayout>{page}</AppLayout>;
};
