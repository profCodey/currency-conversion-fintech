import { ReactElement, useState } from "react";
import { Loader, Modal } from "@mantine/core";
import { AppLayout } from "@/layout/common/app-layout";
import { AddNewGateway, MakeDefaultGateway } from "@/layout/config";
import { useGetGateways, useGetSelectedGateways } from "@/api/hooks/gateways";
import GatewaysDisplay, {
  UnSelectedGateways,
} from "@/layout/config/gateway-display";
import { IGateway } from "@/utils/validators/interfaces";
import { ApiKeyDisplay } from "@/layout/config/api-key-display";
import { useGetClientDetails, useGetCurrentUser } from "@/api/hooks/user";

export default function Settings() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: gateways, isLoading: gatewaysLoading } = useGetGateways();
  const { data: selectedGateways, isLoading: selectedGatewaysLoading } =
    useGetSelectedGateways();
  const {} = useGetClientDetails(currentUser?.data.id);

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
      (gateway) => !selectedGatewayIds.includes(gateway.id)
    ) ?? [];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Configurations</h2>
        <span>Request and manage gateway here</span>
      </div>

      <GatewaysDisplay
        selectedGateways={selectedGatewayData ?? []}
        unSelectedGateways={
          <UnSelectedGateways gateways={unSelectedGateways} />
        }
      />

      <ApiKeyDisplay />
    </div>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
