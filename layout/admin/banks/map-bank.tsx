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

let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export const MapBankValidator = z.object({
  bank_code: z.string().min(1, { message: "Select bank" }),
  gateway_id: z.string().min(1, { message: "Select gateway" }),
  gateway_bank_code: z.string().min(1, { message: "Select gateway" }),
  gateway_bank_name: z.string(),
  bank_name: z.string(),
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
      bank_name: "",
      bank_code: "",
      gateway_id: "",
      gateway_bank_code: "",
      gateway_bank_name: "",
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
    // mapNewBankForm.setFieldValue("gateway_bank_code", "");
    mapNewBankForm.setFieldValue("gateway_id", gateway);
    setCurrentGateway(gateway);
  }

  let gatewayInfo =  gatewayBanks?.data.result?.map((bank) => ({
    label: bank.bankName,
    value: bank.bankCode,
  })) ?? []

  return (
    <>
      <Button
      style={{backgroundColor:colorSecondary}}
        className=" hover:bg-accent"
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
              onChange={(val) => {
                mapNewBankForm.setFieldValue("bank_code", val as string);
                let res = bankOptions.find((item) => item.value === val);
                mapNewBankForm.setFieldValue("bank_name", res?.label);
              }}
              nothingFound={<span>Bank not found</span>}
              searchable
            />
            <Select
              label="Gateway"
              data={gatewayOptions}
              placeholder="Select gateway"
              size="md"
              {...mapNewBankForm.getInputProps("gateway_id")}
              onChange={handleGatewayChange}
            />

            <Select
              label="Select bank from gateway"
              data={gatewayInfo}
              placeholder="Select bank from gateway"
              size="md"
              // {...mapNewBankForm.getInputProps("code")}
              onChange={(val) => {
                mapNewBankForm.setFieldValue("gateway_bank_code", val as string);
                let res = gatewayInfo.find((item) => item.value === val);
                mapNewBankForm.setFieldValue("gateway_bank_name", res?.label as string);
              }}
              disabled={!mapNewBankForm.values.gateway_id}
              // onChange={handleGatewayChange}
              searchable
              dropdownPosition="bottom"
            />
            <TextInput
              label="Bank Display name"
              placeholder="Enter bank name"
              size="md"
              disabled={!mapNewBankForm.values.gateway_id}
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
