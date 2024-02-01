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
import { useGetCurrencies } from "@/api/hooks/currencies";
import Cookies from "js-cookie";

export function FxManualFunding({
    gatewayID,
    closeModal,
}: {
    gatewayID: number | undefined;
    closeModal: () => void;
}) {
    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";
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
            children: (
                <Text>{`Have you paid into the account displayed?`}</Text>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: {
                className: "bg-primary-100",
                loading: postManualFundingLoading,
            },
            onCancel: closeAllModals,
            onConfirm: () => {
                postManualFunding(values);
            },
        });
    }

    function closeForm() {

        closeAllModals();
        fundManualAccountForm.reset();
        closeModal();
    }

    const selectedAccount = fxAccountOptions.find(
        (option) => option.value === String(gatewayID)
    );
    const fundManualAccountForm = useForm({
        initialValues: {
            target_account: selectedAccount
                ? selectedAccount.value.toString()
                : "",
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
                    getCurrencyCodeFromId(bank.currency) === currency?.code
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
                onSubmit={fundManualAccountForm.onSubmit(
                    handleLocalFormSubmit
                )}>
                <LoadingOverlay
                    visible={isLoading || accountsLoading || currenciesLoading}
                />
                <Stack spacing="xs">
                    <Select
                        label="Account"
                        placeholder="Select Account"
                        size="md"
                        disabled
                        data={fxAccountOptions}
                        {...fundManualAccountForm.getInputProps(
                            "target_account"
                        )}
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
                                ? `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                  )
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
                        {...fundManualAccountForm.getInputProps(
                            "sender_narration"
                        )}
                    />

                    {fxBanks?.map(function (bank) {
                        return (
                            <Stack
                                key={bank.id}
                                p="sm"
                                className="bg-gray-30 border">
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Text size="sm">Account Name</Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text size="sm">
                                            {bank.account_name}
                                        </Text>
                                    </Grid.Col>
                                </Grid>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Text size="sm">Account Number</Text>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Text size="sm">
                                            {bank.account_number}
                                        </Text>
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

                    <Text color={colorPrimary}>
                        Kindly ensure that you have paid into the account number
                        above before submitting this form
                    </Text>

                    <Button
                        type="submit"
                        size="md"
                        style={{ backgroundColor: colorSecondary }}
                        loading={postManualFundingLoading}>
                        Confirm Payment
                    </Button>
                </Stack>
            </form>
        </Group>
    );
}
