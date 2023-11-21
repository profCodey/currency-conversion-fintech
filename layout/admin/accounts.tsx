import { useAddNewAccount } from "@/api/hooks/banks";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import {
  Button,
  Modal,
  Select,
  Skeleton,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";
import Cookies from "js-cookie";

let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export const AddNewAccountValidator = z.object({
  account_number: z.string().min(1, { message: "Enter bank name" }),
  account_name: z.string().min(1, { message: "Enter bank name" }),
  bank_name: z.string().min(1, { message: "Enter bank name" }),
  category: z.string().min(1, { message: "Select category" }),
  is_active: z.boolean(),
  currency: z.string(),
});

export function AddAccountButton() {
  const [createBankModalOpen, setCreateBankModalOpen] = useState(false);
  const { mutate: addNewAccount, isLoading: addNewAccountLoading } =
    useAddNewAccount(closeAddBankModal);
  const { allCurrencyOptionsWithId, isLoading } = useCurrencyOptions();
  const addNewAccountForm = useForm({
    initialValues: {
      account_number: "",
      account_name: "",
      bank_name: "",
      category: "local",
      is_active: true,
      currency: "0",
    },
    validate: zodResolver(AddNewAccountValidator),
  });

  function handleNewBankSubmit(values: z.infer<typeof AddNewAccountValidator>) {
    addNewAccount(values);
  }

  function closeAddBankModal() {
    setCreateBankModalOpen(false);
    addNewAccountForm.reset();
  }

  return (
    <>
      <Button
      style={{backgroundColor:colorBackground}}
        className=" hover:bg-primary-100"
        size="md"
        onClick={() => setCreateBankModalOpen(true)}
      >
        Add Account
      </Button>

      <Modal
        title="Create new account"
        opened={createBankModalOpen}
        onClose={closeAddBankModal}
        size="md"
        centered
      >
        <Skeleton visible={isLoading}>
          <form onSubmit={addNewAccountForm.onSubmit(handleNewBankSubmit)}>
            <Stack>
              <TextInput
                label="Account name"
                placeholder="e.g Payceler Global Inc."
                size="md"
                {...addNewAccountForm.getInputProps("account_name")}
              />
              <TextInput
                label="Account number"
                placeholder="e.g 1234567890"
                size="md"
                {...addNewAccountForm.getInputProps("account_number")}
              />
              <TextInput
                label="Bank name"
                placeholder="e.g Standard Trust Bank."
                size="md"
                {...addNewAccountForm.getInputProps("bank_name")}
              />
              <Select
                label="Currency"
                placeholder="Select Currency"
                data={allCurrencyOptionsWithId}
                {...addNewAccountForm.getInputProps("currency")}
              />
              <Select
                label="Category"
                placeholder="Select Category"
                data={[
                  { label: "FX", value: "fx" },
                  { label: "Local", value: "local" },
                ]}
                {...addNewAccountForm.getInputProps("category")}
              />

              <Switch
                label="Activate"
                size="md"
                checked={addNewAccountForm.values.is_active}
                {...addNewAccountForm.getInputProps("is_active")}
              />
              <Button
              style={{backgroundColor:colorBackground}}
                className="hover:bg-primary-100"
                size="md"
                type="submit"
                loading={addNewAccountLoading}
                loaderPosition="right"
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Skeleton>
      </Modal>
    </>
  );
}
