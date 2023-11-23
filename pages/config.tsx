import { ReactElement, useState } from "react";
import { Button, Loader, Modal } from "@mantine/core";
import { AppLayout } from "@/layout/common/app-layout";
import { useGetGateways, useGetSelectedGateways } from "@/api/hooks/gateways";
import GatewaysDisplay, {
  UnSelectedGateways,
} from "@/layout/config/gateway-display";
import { IGateway } from "@/utils/validators/interfaces";
import { ApiKeyDisplay } from "@/layout/config/api-key-display";
import { PageHeader } from "@/components/admin/page-header";
import Cookies from "js-cookie";

export default function Settings() {
  const [showApiCreds, setShowApiCreds] = useState(false);
  const { data: gateways, isLoading: gatewaysLoading } = useGetGateways();
  const { data: selectedGateways, isLoading: selectedGatewaysLoading } =
    useGetSelectedGateways();
    let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
    let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
    let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

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
      (gateway) => !selectedGatewayIds.includes(gateway.id) && gateway.is_active
    ) ?? [];

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Configurations"
        subheader="Request and manage gateway here"
        meta={
          <Button
          style={{ backgroundColor: colorBackground }}
            className=" text-white"
            onClick={() => setShowApiCreds(true)}
          >
            View API credentials
          </Button>
        }
      />

      <GatewaysDisplay
        selectedGateways={selectedGatewayData ?? []}
        unSelectedGateways={
          <UnSelectedGateways gateways={unSelectedGateways} />
        }
      />
      <Modal
        size="lg"
        opened={showApiCreds}
        onClose={() => setShowApiCreds(false)}
        title="API Credentials"
      >
        <ApiKeyDisplay />
      </Modal>
    </div>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
