import { useGetCurrencies } from "@/api/hooks/currencies";
import { useAddNewGlobalList } from "@/api/hooks/admin/compliance/global-limit";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Stack,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMemo, useState } from "react";
import { z } from "zod";

export const globalListFormValidator = z.object({
  daily_limit: z.number().min(2, "Enter a value for daily limit"),
  quarterly_limit: z.number().min(2, "Enter a value for quarterly limit"),
  currency: z.string().nonempty("Select a currency"),
});

export function CreateGlobalLimitButton() {
  const [createRateModalOpen, setCreateRateModalOpen] = useState(false);

  const { mutate: addCurrency, isLoading: currencyLoading } =
    useAddNewGlobalList(closeRateModal);
  const { data: currencyData, isLoading: getCurrencyLoading } =
    useGetCurrencies();
  const currencyOptions: { value: string; label: string }[] = useMemo(() => {
    const options =
      currencyData?.data?.map((currency) => ({
        value: currency.id.toString(),
        label: currency.code,
      })) || [];

    // Add the extra object to index 0
    options.unshift({ value: "0", label: "Select Currency" });

    return options;
  }, [currencyData?.data]);
  const addCurrencyForm = useForm({
    initialValues: {
      daily_limit: 0,
      quarterly_limit: 0,
      currency: "",
    },
    validate: zodResolver(globalListFormValidator),
  });

  function closeRateModal() {
    setCreateRateModalOpen(false);
    addCurrencyForm.reset();
  }

  function handleSubmit(values: z.infer<typeof globalListFormValidator>) {
    // console.log("values", values);
    addCurrency(values);
  }

  return (
    <>
      <Button
        className="bg-primary-100 hover:bg-primary-100"
        size="md"
        onClick={() => setCreateRateModalOpen(true)}
      >
        Add Global Limit
      </Button>

      <Modal
        title="Add Global Limit"
        opened={createRateModalOpen}
        onClose={closeRateModal}
        size="md"
        centered
      >
        <form
          onSubmit={addCurrencyForm.onSubmit(handleSubmit)}
          className="relative"
        >
          <LoadingOverlay visible={currencyLoading || getCurrencyLoading} />
          <Stack>
            <NumberInput
              label="Daily Limit"
              placeholder="e.g. 10000"
              {...addCurrencyForm.getInputProps("daily_limit")}
            />
            <NumberInput
              label="Quarterly Limit"
              placeholder="e.g. 40000"
              {...addCurrencyForm.getInputProps("quarterly_limit")}
            />
            <Select
              label="Currency Code"
              placeholder="Select Currency"
              data={currencyOptions}
              {...addCurrencyForm.getInputProps("currency")}
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
                loading={currencyLoading}
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
