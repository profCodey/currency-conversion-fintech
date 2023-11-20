import { ReactElement, useState } from "react";
import { Button, Loader, Modal,Box, Table } from "@mantine/core";
import { AppLayout } from "@/layout/common/app-layout";
import { useGetGateways, useGetSelectedGateways } from "@/api/hooks/gateways";
import GatewaysDisplay, {
    UnSelectedGateways,
} from "@/layout/config/gateway-display";
import { IGateway } from "@/utils/validators/interfaces";
import { ApiKeyDisplay } from "@/layout/config/api-key-display";
import { PageHeader } from "@/components/admin/page-header";

export default function Collection() {
    const [showApiCreds, setShowApiCreds] = useState(false);
    const { data: gateways, isLoading: gatewaysLoading } = useGetGateways();
    const { data: selectedGateways, isLoading: selectedGatewaysLoading } =
        useGetSelectedGateways();

    if (gatewaysLoading || selectedGatewaysLoading) {
        return (
            <div>
                Loading... <Loader color="green" />
            </div>
        );
    }

    const selectedGatewayData = selectedGateways?.data;

    const selectedGatewayIds =
        selectedGatewayData?.map((gateway) => gateway.gateway) ?? [];

    const unSelectedGateways: IGateway[] =
        gateways?.data.filter(
            (gateway) =>
                !selectedGatewayIds.includes(gateway.id) && gateway.is_active
        ) ?? [];

    return (
        <div className="flex flex-col gap-6 h-full">
            <PageHeader
                header="Collections"
                subheader="Apply for and manage collections here"
            />

            <div className="w-1/3 flex gap-2">
                <Button
                    className="bg-primary-100 hover:bg-primary-100"
                    size="md"
                    // onClick={() => setCreateBankModalOpen(true)}
                >
                    Apply
                </Button>
                <Button
                    className="bg-primary-100 hover:bg-primary-100 text-white"
                    size="md"
                    onClick={() => setShowApiCreds(true)}>
                    View API credentials
                </Button>
            </div>
            <Box className="flex-grow border h-full relative mt-4">
      <Table verticalSpacing="md">
        <thead>
          <tr>
            <th>Status</th>
            <th>Account Name</th>
            <th>Amount</th>
            <th>Narration</th>
            <th>Category</th>
          </tr>
        </thead>
      </Table>

    </Box>
            <Modal
                size="lg"
                opened={showApiCreds}
                onClose={() => setShowApiCreds(false)}
                title="API Credentials">
                <ApiKeyDisplay />
            </Modal>
        </div>
    );
}

Collection.getLayout = function getLayout(page: ReactElement) {
    return <AppLayout>{page}</AppLayout>;
};
