import { useGetCurrencies } from "@/api/hooks/currencies";
import { useAddNewUserList } from "@/api/hooks/admin/compliance/user-limit";
import { useUsersList } from "@/api/hooks/admin/users";
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
import Cookies from "js-cookie";

let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export const globalListFormValidator = z.object({
  daily_limit: z.number().min(2, "Enter a value for daily limit"),
  quarterly_limit: z.number().min(2, "Enter a value for quarterly limit"),
  currency: z.string().nonempty("Select a currency"),
  user: z.string().nonempty("Select a user"),
});

export function CreateUserLimitButton() {
  const [createRateModalOpen, setCreateRateModalOpen] = useState(false);

  const { mutate: addCurrency, isLoading: currencyLoading } =
    useAddNewUserList(closeRateModal);
  const { data: currencyData, isLoading: getCurrencyLoading } =
    useGetCurrencies();
  const { data: usersList, isLoading: usersLoading } = useUsersList();
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

  const userOptions: { value: string; label: string }[] = useMemo(() => {
    const options =
      usersList?.data?.map((user) => ({
        value: user.id.toString(),
        label: `${user.first_name} ${user.last_name} (${user.email})`,
      })) || [];

    // Add the extra object to index 0
    options.unshift({ value: "0", label: "Select User" });

    return options;
  }, [usersList?.data]);

  const addCurrencyForm = useForm({
    initialValues: {
      daily_limit: 0,
      quarterly_limit: 0,
      user: "",
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
        style={{ backgroundColor: colorBackground }}
        className="hover:bg-primary-100"
        size="md"
        onClick={() => setCreateRateModalOpen(true)}
      >
        Add User Limit
      </Button>

      <Modal
        title="Add User Limit"
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
            <Select
              label="Users"
              placeholder="Select User"
              data={userOptions}
              {...addCurrencyForm.getInputProps("user")}
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
