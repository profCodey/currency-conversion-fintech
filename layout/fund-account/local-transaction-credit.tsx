import { useEffect, useState } from "react";
import { useAccountOptions } from "@/api/hooks/accounts";
import { QueryFunctionContext, QueryKey } from "@tanstack/react-query"; // Import the missing type

import {
    useGetPaycelerBankDetails,
    useLoadTransactionCredit,
    useGetTransactionCharges,
} from "@/api/hooks/banks";
import { localTransactionCreditFormValidator } from "@/utils/validators";
import {
    Button,
    Group,
    LoadingOverlay,
    NumberInput,
    Select,
    Stack,
    Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals, modals } from "@mantine/modals";
import Cookies from "js-cookie";
import { useGetCurrencies } from "@/api/hooks/currencies";
import { currencyFormatter, getCurrency } from "@/utils/currency";
import Pill from "@/components/pills";
import { z } from "zod";

export function LoadTransactionCredit({
    gatewayID,
    currencyId,
    closeModal,
}: {
    gatewayID: number | undefined;
    closeModal: () => void;
}) {
    const colorPrimary = Cookies.get("primary_color") || "#132144";
    const colorSecondary = Cookies.get("secondary_color") || "#132144";

    const { data: bankDetails, isLoading: bankDetailsLoading } =
        useGetPaycelerBankDetails();
    const {
        fxAccountOptions,
        accountOptions,
        isLoading: accountsLoading,
    } = useAccountOptions();
    const { getCurrencyCodeFromId, isLoading: currenciesLoading } =
        useGetCurrencies();

    const {
        mutate: LoadTransactionCredit,
        isLoading: loadTansactionCreditLoading,
    } = useLoadTransactionCredit(closeForm);

    const selectedAccount = fxAccountOptions.find(
        (option) => option.value === String(gatewayID)
    );

    const localTransactionCreditForm = useForm({
        initialValues: {
            source_account: selectedAccount?.value?.toString() || "",
            unit: 1000,
            destination_account: "",
        },
        validate: zodResolver(localTransactionCreditFormValidator),
    });

    const {
        data: transactionCharges,
        error: transactionChargesError,
        isLoading: transactionChargesLoading,
        mutate: getTransactionCharges,
    } = useGetTransactionCharges(
        selectedAccount?.value?.toString() || null,
        localTransactionCreditForm.values.destination_account || null
    );

    const [showUnitInput, setShowUnitInput] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        if (localTransactionCreditForm.values.destination_account) {
            const sourceAccountId =
                selectedAccount?.value?.toString() ||
                localTransactionCreditForm.values.source_account;
            const destinationAccountId =
                localTransactionCreditForm.values.destination_account;

            // Make sure to use the correct function name for the mutation
            getTransactionCharges({
                source_account_id: sourceAccountId,
                destination_account_id: destinationAccountId,
            } as unknown as QueryFunctionContext<QueryKey, any>); // Add type assertion here
        }
    }, [
        getTransactionCharges,
        localTransactionCreditForm.values.destination_account,
        localTransactionCreditForm.values.source_account,
        selectedAccount?.value,
    ]);

   

    
    useEffect(() => {
        if (
            !transactionChargesLoading &&
            !transactionChargesError &&
            transactionCharges
        ) {
            setShowUnitInput(true);
        } else {
            setErrorMessage(true);
        }
    }, [
        transactionChargesLoading,
        transactionChargesError,
        transactionCharges,
    ]);

    function handleLocalFormSubmit(
        values: z.infer<typeof localTransactionCreditFormValidator>
    ) {
        modals.openConfirmModal({
            title: "Please confirm the following details",
            children: (
                <Text>{`Are you sure you want to load transaction credit to this account?`}</Text>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: {
                className: "bg-primary-100",
                loading: loadTansactionCreditLoading,
            },
            onCancel: closeAllModals,
            onConfirm: () => {
                LoadTransactionCredit(values);
            },
        });
    }

    function closeForm() {
        closeAllModals();
    }

    const totalToPay =
        showUnitInput && transactionCharges
            ? localTransactionCreditForm.values.unit *
              transactionCharges.data.charges
            : 0;
    return (
        <Group spacing="xl" py={0} className="h-full">
            <form
                className="w-full sm:w-[400px] relative"
                onSubmit={localTransactionCreditForm.onSubmit(
                    handleLocalFormSubmit
                )}>
                <LoadingOverlay
                    visible={
                        // bankDetailsLoading ||
                        accountsLoading ||
                        currenciesLoading ||
                        // transactionChargesLoading ||
                        loadTansactionCreditLoading
                    }
                />
                <Stack spacing="xs">
                    <Select
                        label="Source Account"
                        placeholder="Select Account"
                        size="md"
                        disabled
                        style={{ marginTop: 10 }}
                        data={fxAccountOptions}
                        {...localTransactionCreditForm.getInputProps(
                            "source_account"
                        )}
                    />
                    <Select
                        label="Destination Account"
                        placeholder="Select Account"
                        size="md"
                        style={{ marginTop: 10 }}
                        data={accountOptions}
                        {...localTransactionCreditForm.getInputProps(
                            "destination_account"
                        )}
                    />
                    {showUnitInput && (
                        <>
                            {transactionCharges && (
                                <>
                                   <div className="text-center">
                                   <Pill
                                        text={`Charges per transaction: ${getCurrency(
                                            getCurrencyCodeFromId(currencyId)
                                        )}${currencyFormatter(
                                            transactionCharges.data.charges
                                        )}`}
                                        color="bg-green-500"
                                    />
                                   </div>
                                    <NumberInput
                                        size="md"
                                        label="Enter Unit"
                                        placeholder="Enter Unit"
                                        hideControls={false}
                                        withAsterisk
                                        formatter={(value: string) =>
                                            !Number.isNaN(parseFloat(value))
                                                ? `${value}`.replace(
                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                      ","
                                                  )
                                                : ""
                                        }
                                        {...localTransactionCreditForm.getInputProps(
                                            "unit"
                                        )}
                                    />
                                    <Text className="text-center">
                                        <Pill
                                            text={`You will be charged a total amount: ${getCurrency(
                                                getCurrencyCodeFromId(
                                                    currencyId
                                                )
                                            )}${currencyFormatter(totalToPay)}`}
                                            color="bg-green-500" // Replace with the actual color you want
                                        />
                                    </Text>
                                </>
                            )}
                        </>
                    )}
                    <Button
                        type="submit"
                        size="md"
                        style={{ backgroundColor: colorSecondary, marginTop: 30 }}
                        loading={loadTansactionCreditLoading}
                        disabled={!transactionCharges}>
                        Confirm Load
                    </Button>
                </Stack>
            </form>
        </Group>
    );
}
