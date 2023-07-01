import { useBankOptions, useMapNewBank } from "@/api/hooks/admin/banks";
import { useGatewayOptions } from "@/api/hooks/gateways";
import {
  Button,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";

export const MapBankValidator = z.object({
  bank: z.string().min(1, { message: "Select bank" }),
  gateway: z.string().min(1, { message: "Select gateway" }),
  code: z.string().min(1, { message: "Select gateway" }),
  bank_name: z.string().min(1, { message: "Enter bank name" }),
});

export function MapBankButton() {
  const [mapBankModalOpen, setMapBankModalOpen] = useState(false);
  const { bankOptions, isLoading: banksLoading } = useBankOptions();
  const { gatewayOptions, isLoading: gatewaysLoading } = useGatewayOptions();

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

  return (
    <>
      <Button
        className="bg-accent hover:bg-accent"
        size="md"
        onClick={() => setMapBankModalOpen(true)}
      >
        Map Bank
      </Button>

      <Modal
        title="Map new bank"
        opened={mapBankModalOpen}
        onClose={closeAddBankModal}
        size="md"
        centered
        className="relative"
      >
        <LoadingOverlay visible={banksLoading || gatewaysLoading} />
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
            />
            <TextInput
              label="Code"
              placeholder="Enter code"
              size="md"
              {...mapNewBankForm.getInputProps("code")}
            />
            <TextInput
              label="Bank name"
              placeholder="Enter bank name"
              size="md"
              {...mapNewBankForm.getInputProps("bank_name")}
            />
            <Button
              className="bg-primary-100 hover:bg-primary-100"
              size="md"
              type="submit"
              loading={mapNewBankLoading}
              loaderPosition="right"
            >
              Submit Mapping
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
