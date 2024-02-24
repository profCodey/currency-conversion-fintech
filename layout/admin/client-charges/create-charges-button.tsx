import { useAddClientCharge } from "@/api/hooks/admin/client-charges";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";
import Cookies from "js-cookie";
import { useUsersList } from "@/api/hooks/admin/users";
import { useGetCurrencies } from "@/api/hooks/currencies";

export const clientChargeFormValidator = z.object({
  client: z.number().gt(0, "Kindly select a user"),
  source_currency: z.number().gt(0, "Kindly select source currency"),
  amount: z.string().min(1, "Enter a value for amount"),
});

export function CreateClientChargeButton() {
  const [clientChargeModalOpen, setAddClientChargeModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { mutate: addClientCharge, isLoading: clientChargeLoading } =
    useAddClientCharge(closeClientChargeModal);
  const { data: usersList, isLoading: usersLoading } = useUsersList();
  const { isLoading: currencyLoading, data: currencies } =
    useGetCurrencies();

  const addClientChargeForm = useForm({
    initialValues: {
      client: 0,
      source_currency: 0,
      amount: "",
    },
    validate: zodResolver(clientChargeFormValidator),
  });

  function closeClientChargeModal() {
    setAddClientChargeModalOpen(false);
    addClientChargeForm.reset();
  }

  function handleSubmit(values: z.infer<typeof clientChargeFormValidator>) {
    //@ts-ignore
    addClientCharge(addClientChargeForm.values);
  }

  let colorBackground = Cookies.get("background_color")
    ? Cookies.get("background_color")
    : "#132144";

  function handleUserId(value: string | null) {
    setUserId(value);
    addClientChargeForm.setFieldValue("client", Number(value));
  }

  function handleSourceCurrency(value: string | null) {
    addClientChargeForm.setFieldValue("source_currency", Number(value));
  }

  return (
    <>
      <Button
        style={{ backgroundColor: colorBackground }}
        className=" hover:bg-primary-100"
        size="md"
        onClick={() => setAddClientChargeModalOpen(true)}
      >
        Add New Client Charge
      </Button>

      <Modal
        title="Add New Client Charge"
        opened={clientChargeModalOpen}
        onClose={closeClientChargeModal}
        size="md"
        centered
        closeOnClickOutside={false}
      >
        <form
          onSubmit={addClientChargeForm.onSubmit(handleSubmit)}
          className="relative"
        >
          <LoadingOverlay visible={clientChargeLoading} />
          <Stack>
            <Select
              label="Select User"
              data={
                usersList?.data?.map((user) => ({
                  label: `${user.first_name} ${user.last_name}`,
                  value: user.id.toString(),
                })) ?? []
              }
              placeholder="Click to select user from list"
              size="md"
              onChange={(value) => {
                handleUserId(value);
              }}
              searchable
              required
            />

            <TextInput
              label="Amount"
              placeholder="Enter Amount"
              type="text"
              size="md"
              {...addClientChargeForm.getInputProps("amount")}
              required
            />

            <Select
              label="Source Currency"
              data={
                [
                  { label: "", value: "" }, // Add an empty object at index 0
                  ...(currencies?.data?.map((currency) => ({
                    label: `${currency.name}`,
                    value: currency.id.toString(),
                  })) ?? [])
                ]
              }
              placeholder="Click to select source currency from the list"
              size="md"
              onChange={(value) => {
                handleSourceCurrency(value);
              }}
              searchable
              nothingFound={"No currency"}
              required
            />

            <Group grow>
              <Button
                className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                size="md"
                type="button"
                onClick={closeClientChargeModal}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: colorBackground }}
                className="hover:bg-primary-100"
                size="md"
                type="submit"
                loading={clientChargeLoading}
                loaderPosition="right"
              >
                Add Charge
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
