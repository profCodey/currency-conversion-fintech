import {
  useGetManualFundings,
  useGetPaycelerBankDetails,
  usePostManualFunding,
} from "@/api/hooks/banks";
import { useGetSelectedGateways } from "@/api/hooks/gateways";
import { AppLayout } from "@/layout/common/app-layout";
import { fundManualAccount } from "@/utils/validators";
import {
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals, modals } from "@mantine/modals";
import { ReactElement, useMemo, useState } from "react";
import { z } from "zod";

export default function FundAccount() {
  const { data: bankDetails, isLoading } = useGetPaycelerBankDetails();
  const { data: selectedGateways, isLoading: selectedGatewaysLoading } =
    useGetSelectedGateways();
  const { data: manualFundings, isLoading: manualFundingsLoading } =
    useGetManualFundings();

  const { mutate: postManualFunding, isLoading: postManualFundingLoading } =
    usePostManualFunding(closeAllModals);

  const fundManualAccountForm = useForm({
    initialValues: {
      amount: 1000,
      account_name: "",
      gateway: "",
      narration: "",
    },
    validate: zodResolver(fundManualAccount),
  });

  function handleLocalFormSubmit(values: z.infer<typeof fundManualAccount>) {
    console.log(values);

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

  const localBanks = useMemo(
    function () {
      return bankDetails?.data.filter((bank) => bank.category === "local");
    },
    [bankDetails?.data]
  );

  const gatewayOptions = useMemo(
    function () {
      return (
        selectedGateways?.data.map((gateway) => ({
          label: gateway.gateway_name,
          value: gateway.gateway.toString(),
        })) ?? []
      );
    },
    [selectedGateways?.data]
  );

  const rows = useMemo(
    function () {
      return manualFundings?.data.map(function (funding) {
        return (
          <tr key={funding.id}>
            <td>{funding.status}</td>
            <td>{funding.account_name}</td>
            <td>{funding.amount}</td>
            <td>{funding.reference}</td>
            <td>{funding.gateway_name}</td>
          </tr>
        );
      });
    },
    [manualFundings?.data]
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Fund Wallet</h2>
        <span>fund your wallet here</span>
      </div>
      <Tabs
        variant="default"
        defaultValue="local"
        classNames={{ panel: "h-full" }}
      >
        <Tabs.List>
          <Tabs.Tab value="local">Local</Tabs.Tab>
          <Tabs.Tab value="foreign">Foreign</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="local">
          <Group spacing="xl" py={0} className="h-full">
            <form
              className="w-[400px]"
              onSubmit={fundManualAccountForm.onSubmit(handleLocalFormSubmit)}
            >
              <Stack spacing="xs">
                <NumberInput
                  size="md"
                  label="Enter amount"
                  placeholder="Enter amount"
                  hideControls={false}
                  withAsterisk
                  parser={(value: string) => value.replace(/\₦\s?|(,*)/g, "")}
                  formatter={(value: string) =>
                    !Number.isNaN(parseFloat(value))
                      ? `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "₦ "
                  }
                  {...fundManualAccountForm.getInputProps("amount")}
                />
                <TextInput
                  label="Account name"
                  placeholder="Enter account name"
                  size="md"
                  {...fundManualAccountForm.getInputProps("account_name")}
                />
                <Select
                  label="Select Gateway"
                  placeholder="Select Gateway"
                  size="md"
                  defaultValue={gatewayOptions[0]?.value}
                  data={gatewayOptions}
                  nothingFound={<span>No gateway found</span>}
                  {...fundManualAccountForm.getInputProps("gateway")}
                />
                <Textarea
                  label="Narration"
                  placeholder="Enter Narration"
                  size="md"
                  {...fundManualAccountForm.getInputProps("narration")}
                />

                {localBanks?.map(function (bank) {
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
                  Pay Into The Account Above and wait for 2 minutes before
                  clicking the Confirm payment Button
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

            <Box className="flex-grow border h-full relative">
              <LoadingOverlay visible={manualFundingsLoading} />
              <Table verticalSpacing="md">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Account Name</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Gateway name</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </Box>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="foreign" pt="lg">
          Hello world
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

FundAccount.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
