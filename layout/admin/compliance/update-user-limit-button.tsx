import { useGetCurrencies } from "@/api/hooks/currencies";
import { usePutUserList } from "@/api/hooks/admin/compliance/user-limit";
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
  user: z.string().nonempty("Select a user"),
});

interface UpdateUserLimitButtonProps {
  handleEditUserList: (bool: boolean) => void;
  userLimitId: number;
  daily: number;
  quarterly: number;
}

export function UpdateUserLimitButton({
  handleEditUserList,
  daily,
  quarterly,
  userLimitId,
}: UpdateUserLimitButtonProps) {
  const [createRateModalOpen, setCreateRateModalOpen] = useState(true);
  const { data: currencyData, isLoading: getCurrencyLoading } =
    useGetCurrencies();
  const { mutate: updateUserLimit, isLoading: updateUserLimitLoading } =
    usePutUserList(userLimitId, closeRateModal);

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
      daily_limit: daily,
      quarterly_limit: quarterly,
      user: userLimitId.toString(),
      currency: "",
    },
    validate: zodResolver(globalListFormValidator),
  });

  function closeRateModal() {
    setCreateRateModalOpen(false);
    handleEditUserList(false);
    addCurrencyForm.reset();
  }

  function handleSubmit(values: z.infer<typeof globalListFormValidator>) {
    updateUserLimit(values);
  }

  return (
    <>
      <Modal
        title="Edit User Limit"
        opened={createRateModalOpen}
        onClose={closeRateModal}
        size="md"
        centered
      >
        <form
          onSubmit={addCurrencyForm.onSubmit(handleSubmit)}
          className="relative"
        >
          <LoadingOverlay
            visible={getCurrencyLoading || updateUserLimitLoading}
          />
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
                loading={updateUserLimitLoading || getCurrencyLoading}
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
