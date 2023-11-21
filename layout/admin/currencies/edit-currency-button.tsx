import { useEditNewCurrency } from "@/api/hooks/currencies";
import { ICurrency } from "@/utils/validators/interfaces";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";
import { Dispatch, SetStateAction } from "react";
import Cookies from "js-cookie";

let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export const editcurrencyFormValidator = z.object({
  id: z.number().min(1, "id"),
  code: z.string().min(2, "code"),
  name: z.string().min(3, "name"),
});

interface EditCurrencyButtonProps {
  currency: ICurrency;
  setCurrency: Dispatch<SetStateAction<ICurrency | null>>;
}

export function EditCurrencyButton({
  currency,
  setCurrency,
}: EditCurrencyButtonProps) {
  const [createRateModalOpen, setCreateRateModalOpen] = useState(true);

  const { mutate: editCurrency, isLoading: currencyLoading } =
    useEditNewCurrency(closeRateModal);

  const addCurrencyForm = useForm({
    initialValues: {
      id: currency.id,
      code: currency.code,
      name: currency.name,
    },
    validate: zodResolver(editcurrencyFormValidator),
  });

  function closeRateModal() {
    setCurrency(null);
    setCreateRateModalOpen(false);
    addCurrencyForm.reset();
  }

  function handleSubmit(values: z.infer<typeof editcurrencyFormValidator>) {
    setCurrency(null);
    editCurrency(values);
  }

  return (
    <>
      <Modal
        title="Edit Currency"
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
                style={{ backgroundColor: colorBackground }}
                className="hover:bg-primary-100"
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
