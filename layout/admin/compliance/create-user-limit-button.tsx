import { useAddNewCurrency } from "@/api/hooks/currencies";
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
import { useState } from "react";
import { z } from "zod";

export const currencyFormValidator = z.object({
code: z.string().min(2, "code"),
name: z.string().min(3, "name"),
});
export function CreateUserLimitButton() {
  const [createRateModalOpen, setCreateRateModalOpen] = useState(false);

const { mutate: addCurrency, isLoading: currencyLoading } =
useAddNewCurrency(closeRateModal);

  const addCurrencyForm = useForm({
    initialValues: {
      code: "",
      name: ""
    },
    validate: zodResolver(currencyFormValidator),
  });

  function closeRateModal() {
    setCreateRateModalOpen(false);
    addCurrencyForm.reset();
  }

  function handleSubmit(values: z.infer<typeof currencyFormValidator>) {
    addCurrency(values);
  }

  return (
    <>
      <Button
        className="bg-primary-100 hover:bg-primary-100"
        size="md"
        onClick={() => setCreateRateModalOpen(true)}
      >
        Add User Limit
      </Button>

      <Modal
        title="Add new currency"
        opened={createRateModalOpen}
        onClose={closeRateModal}
        size="md"
        centered
      >
        <form
          onSubmit={addCurrencyForm.onSubmit(handleSubmit)}
          className="relative"
        >
<LoadingOverlay visible={currencyLoading} />
          <Stack>
          <TextInput
              label="Currency Code"
              placeholder="e.g. USD"
              {...addCurrencyForm.getInputProps("code")}
            />
               <TextInput
              label="Currency Name"
              placeholder="e.g. Dollar"
              {...addCurrencyForm.getInputProps("name")}
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
