import { useAccountOptions } from "@/api/hooks/accounts";
import {
  useGetPaycelerBankDetails,
  usePostManualFunding,
} from "@/api/hooks/banks";
import { fundManualAccount } from "@/utils/validators";
import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals, modals } from "@mantine/modals";
import { useMemo } from "react";
import { z } from "zod";
import { ManualFundingHistory } from "../transactions/manual-funding";
import { useGetCurrencies } from "@/api/hooks/currencies";

export function FxManualFunding() {
  const { data: bankDetails, isLoading } = useGetPaycelerBankDetails();
  const {
    fxAccountOptions,
    getAccountCurrency,
    isLoading: accountsLoading,
  } = useAccountOptions();
  const { getCurrencyCodeFromId, isLoading: currenciesLoading } =
    useGetCurrencies();
  const { mutate: postManualFunding, isLoading: postManualFundingLoading } =
    usePostManualFunding(closeForm);
  function handleLocalFormSubmit(values: z.infer<typeof fundManualAccount>) {
    modals.openConfirmModal({
      title: "Please confirm the following details",
      children: <Text>{`Have you paid into the account displayed?`}</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: {
        className: "bg-primary-100",
        loading: postManualFundingLoading,
      },
      onCancel: closeAllModals,
      onConfirm: () => postManualFunding(values),
    });
  }

  function closeForm() {
    closeAllModals();
    fundManualAccountForm.reset();
  }

  const fundManualAccountForm = useForm({
    initialValues: {
      target_account: "",
      amount: 1000,
      sender_name: "",
      sender_narration: "",
      category: "fx",
    },
    validate: zodResolver(fundManualAccount),
  });

  const fxBanks = useMemo(
    function () {
      const currency = getAccountCurrency(
        fundManualAccountForm.values.target_account
      );
      return bankDetails?.data.filter(
        (bank) =>
          bank.category === "fx" &&
          getCurrencyCodeFromId(bank.currency) === currency
      );
    },
    [
      bankDetails?.data,
      fundManualAccountForm.values.target_account,
      getAccountCurrency,
      getCurrencyCodeFromId,
    ]
  );

  return (
    <Group spacing="xl" py={0} className="h-full">
      <form
        className="w-full sm:w-[400px] relative"
        onSubmit={fundManualAccountForm.onSubmit(handleLocalFormSubmit)}
      >
        <LoadingOverlay
          visible={isLoading || accountsLoading || currenciesLoading}
        />
        <Stack spacing="xs">
          <Select
            label="Account"
            placeholder="Select Account"
            size="md"
            data={fxAccountOptions}
            {...fundManualAccountForm.getInputProps("target_account")}
          />
          <NumberInput
            size="md"
            label="Enter amount"
            placeholder="Enter amount"
            hideControls={false}
            withAsterisk
            // parser={(value: string) => value.replace(/\₦\s?|(,*)/g, "")}
            formatter={(value: string) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            {...fundManualAccountForm.getInputProps("amount")}
          />
          <TextInput
            label="Sender name"
            placeholder="Enter sender name"
            size="md"
            {...fundManualAccountForm.getInputProps("sender_name")}
          />
          <Textarea
            label="Narration"
            placeholder="Enter Narration"
            size="md"
            {...fundManualAccountForm.getInputProps("sender_narration")}
          />

          {fxBanks?.map(function (bank) {
            return (
              <Stack key={bank.id} p="sm" className="bg-gray-30 border">
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="sm">Account Name</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm">{bank.account_name}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="sm">Account Number</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm">{bank.account_number}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="sm">Bank Name</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm">{bank.bank_name}</Text>
                  </Grid.Col>
                </Grid>
              </Stack>
            );
          })}

          <Text color="#0DC300">
            Pay Into The Account Above and wait for 2 minutes before clicking
            the Confirm payment Button
          </Text>

          <Button
            type="submit"
            size="md"
            className="bg-accent"
            loading={postManualFundingLoading}
          >
            Confirm Payment
          </Button>
        </Stack>
      </form>

      <ManualFundingHistory />
    </Group>
  );
}
