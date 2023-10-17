import { useAddNewRate } from "@/api/hooks/admin/rates";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals, openModal } from "@mantine/modals";
import { Warning2 } from "iconsax-react";
import { useState } from "react";
import { z } from "zod";

export const rateFormValidator = z.object({
  rate: z.number().gt(0, "Enter a value for rate"),
  is_active: z.boolean(),
  source_currency: z.string().min(1, "Select source currency"),
  destination_currency: z.string().min(1, "Select destination currency"),
});

export function CreateRateButton() {
  const [createRateModalOpen, setCreateRateModalOpen] = useState(false);
  const { mutate: addRate, isLoading: rateLoading } =
    useAddNewRate(closeRateModal);
  const { currencyOptionsWithId, isLoading } =
    useCurrencyOptions();
  const addRateForm = useForm({
    initialValues: {
      rate: 0.0,
      is_active: false,
      source_currency: "",
      destination_currency: "",
    },
    validate: zodResolver(rateFormValidator),
  });

  function closeRateModal() {
    setCreateRateModalOpen(false);
    addRateForm.reset();
  }

  function handleSubmit(values: z.infer<typeof rateFormValidator>) {
    if (values.destination_currency === values.source_currency) {
      return addRateForm.setFieldError(
        "destination_currency",
        "Destination currency cannot be same as source"
      );
    }
    // if (values.destination_currency === values.source_currency) {
    //   return modals.open({
    //     children: (
    //       <Stack align="center">
    //         <Warning2 color="red" size={80} variant="TwoTone" />
    //         <span className="text-xl text-center">
    //           Source and Destination currency cannot be the same
    //         </span>
    //       </Stack>
    //     ),
    //     withCloseButton: false,
    //   });
    // }
    addRate(values);
  }

  return (
    <>
      <Button
        className="bg-primary-100 hover:bg-primary-100"
        size="md"
        onClick={() => setCreateRateModalOpen(true)}
      >
        Create Rate
      </Button>

      <Modal
        title="Create new rate"
        opened={createRateModalOpen}
        onClose={closeRateModal}
        size="md"
        centered
      >
        <form
          onSubmit={addRateForm.onSubmit(handleSubmit)}
          className="relative"
        >
          <LoadingOverlay visible={isLoading} />
          <Stack>
            <NumberInput
              label="Rate"
              placeholder="0.00"
              {...addRateForm.getInputProps("rate")}
            />
            <Select
              label="Source currency"
              placeholder="Select currency"
              data={currencyOptionsWithId}
              size="md"
              {...addRateForm.getInputProps("source_currency")}
            />
            <Select
              label="Destination currency"
              placeholder="Select currency"
              data={currencyOptionsWithId}
              size="md"
              {...addRateForm.getInputProps("destination_currency")}
            />
            <Switch
              label="Activate rate"
              size="md"
              checked={addRateForm.values.is_active}
              {...addRateForm.getInputProps("is_active")}
            />
            <Group grow>
              <Button
                className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                size="md"
                type="button"
                onClick={closeRateModal}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary-100 hover:bg-primary-100"
                size="md"
                type="submit"
                loading={rateLoading}
                loaderPosition="right"
              >
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
