import { useBankOptions, useMapNewBank } from "@/api/hooks/admin/banks";
import { useGetBanks, useGetBanksForGateway } from "@/api/hooks/banks";
import { useGatewayOptions } from "@/api/hooks/gateways";
import {
  Button,
  Drawer,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { z } from "zod";
import Cookies from "js-cookie";

export const MapBankValidator = z.object({
  bank: z.string().min(1, { message: "Select bank" }),
  gateway: z.string().min(1, { message: "Select gateway" }),
  code: z.string().min(1, { message: "Select gateway" }),
  bank_name: z.string().min(1, { message: "Enter bank name" }),
});

export function MapBankButton() {
  const [mapBankModalOpen, setMapBankModalOpen] = useState(false);
  const [currentGateway, setCurrentGateway] = useState<string | null>(null);
  const { bankOptions, isLoading: banksLoading } = useBankOptions();
  const { gatewayOptions, isLoading: gatewaysLoading } = useGatewayOptions();
  const { data: gatewayBanks, isLoading: gatewayBanksLoading } =
    useGetBanksForGateway(currentGateway);
  const {} = useGetBanks();

  useEffect(
    function () {
      if (gatewayOptions) {
        setCurrentGateway(gatewayOptions[0]?.value);
      }
    },
    [gatewayOptions]
  );

  const { mutate: mapNewBank, isLoading: mapNewBankLoading } =
    useMapNewBank(closeAddBankModal);

  const mapNewBankForm = useForm({
    initialValues: {
      bank: "",
      gateway: "",
      code: "",
      bank_name: "",
    },
    validate: zodResolver(MapBankValidator),
  });

  function handleNewBankSubmit(values: z.infer<typeof MapBankValidator>) {
    mapNewBank(values);
  }

  function closeAddBankModal() {
    setMapBankModalOpen(false);
    mapNewBankForm.reset();
  }

  function handleGatewayChange(gateway: string) {
    mapNewBankForm.setFieldValue("code", "");
    mapNewBankForm.setFieldValue("gateway", gateway);
    setCurrentGateway(gateway);
  }
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  return (
    <>
      <Button
      style={{backgroundColor:colorBackground}}
        className="bg-accent hover:bg-accent"
        size="md"
        onClick={() => setMapBankModalOpen(true)}
      >
        Map Bank
      </Button>

      <Drawer
        title="Map new bank"
        opened={mapBankModalOpen}
        onClose={closeAddBankModal}
        size="md"
        className="relative"
        position="right"
      >
        <LoadingOverlay
          visible={banksLoading || gatewaysLoading || gatewayBanksLoading}
        />
        <form onSubmit={mapNewBankForm.onSubmit(handleNewBankSubmit)}>
          <Stack>
            <Select
              label="Bank"
              data={bankOptions}
              placeholder="Select Bank"
              size="md"
              {...mapNewBankForm.getInputProps("bank")}
              nothingFound={<span>Bank not found</span>}
              searchable
            />
            <Select
              label="Gateway"
              data={gatewayOptions}
              placeholder="Select gateway"
              size="md"
              {...mapNewBankForm.getInputProps("gateway")}
              onChange={handleGatewayChange}
            />

            <Select
              label="Select bank from gateway"
              data={
                gatewayBanks?.data.result?.map((bank) => ({
                  label: bank.bankName,
                  value: bank.bankCode,
                })) ?? []
              }
              placeholder="Select bank from gateway"
              size="md"
              {...mapNewBankForm.getInputProps("code")}
              disabled={!mapNewBankForm.values.gateway}
              // onChange={handleGatewayChange}
              searchable
              dropdownPosition="bottom"
            />
            <TextInput
              label="Bank Display name"
              placeholder="Enter bank name"
              size="md"
              disabled={!mapNewBankForm.values.gateway}
              {...mapNewBankForm.getInputProps("bank_name")}
            />
            <Button
            style={{backgroundColor:colorBackground}}
              className="hover:bg-primary-100"
              size="md"
              type="submit"
              loading={mapNewBankLoading}
              loaderPosition="right"
            >
              Submit Mapping
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}
