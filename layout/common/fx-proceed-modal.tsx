import { useLocalBalance } from "@/api/hooks/balance";
import {
    useCreateFxPayout,
    useCreatePayout,
    useNameEnquiry,
} from "@/api/hooks/banks";
import IconAt from "@/components/icons/icon-at";
import { queryClient } from "@/pages/_app";
import { SUPPORTED_FILE_FORMATS } from "@/utils/constants";
import { allCountries, allCountryNames } from "@/utils/countries";
import { currencyFormatter } from "@/utils/currency";
import {
    Button,
    Group,
    LoadingOverlay,
    Modal,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
    Textarea,
    FileInput,
    rem,
    SelectItem,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { ArrowRight, Danger, DirectboxSend, Warning2 } from "iconsax-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FxTransferOperationStage } from "./fx-forms/dollar-form";
import { CurrencyDetailType, FxPurpose } from "@/utils/validators/interfaces";

export const ConvertFundFxPayRecipient = z.object({
    // bank: z.string().min(1, { message: "Bank name is required" }).optional(),
    // bank_address: z.string().optional(),
    // currency: z.string().min(1, { message: "Currency is required" }),
    amount: z.number().gte(1),
    account_name: z
        .string()
        .min(1, { message: "Account name is required" })
        .optional(),
    account_number: z
        .string()
        .min(1, { message: "Account number is required" })
        .optional(),
    narration: z.string().min(1, { message: "Narration is required" }),
    bank_name: z.string(),
    purpose_of_payment: z
        .string()
        .min(1, { message: "Purpose of payment is required" }),
    sort_code: z.string().optional(),
    bic: z
        .string()
        .min(1, { message: "BIC cannot be empty" })
        .max(11, { message: "BIC should be maximum of 11 characters" }),
    city: z.string(),
    country: z.string().min(1, { message: "Country is required!" }),
    state: z.string().min(1, { message: "state is required" }),
    zipcode: z.string().min(1, { message: "zipcode is required" }),
    swift_code: z.string().optional(),
    invoice: z
        .object({
            name: z.string(),
            type: z.string(),
            size: z.number(),
        })
        .refine(
            (file) => {
                // console.log({invoice_file:file});
                const check =
                    !!file && SUPPORTED_FILE_FORMATS.includes(file.type);
                // console.log({invoiceCheck:check},"invoice'");

                return check;
            },
            {
                message: `Source of Fund is required,formats are .jpeg,.jpg,.png,.pdf,.doc,.docx`,
            }
        ),
    source_of_funds: z
        .object({
            name: z.string(),
            type: z.string(),
            size: z.number(),
        })
        .refine(
            (file) => {
                // console.log({source_of_funds_file:file});
                const check =
                    !!file && SUPPORTED_FILE_FORMATS.includes(file.type);
                // console.log({check},"funds'");

                return check;
            },
            {
                message: `Source of Fund is required,formats are .jpeg,.jpg,.png,.pdf,.doc,.docx`,
            }
        ),
});

interface SendMoneyProps {
    modalOpen: boolean;
    close(): void;
    banks: { label: string; value: string }[];
    currencies: { label: string; value: string }[];
    gateway: number | undefined;
    recipientDetails: z.infer<typeof ConvertFundFxPayRecipient>;
    destinationDetails: CurrencyDetailType;
    sourceDetails: CurrencyDetailType;
    sourceAmount: number;
    currencyRate: number;
    purposes: SelectItem[];
    destinationAmount: number;
    sourceCurrency: string;
    destinationAccCurrency: string;
}

export type TransferOperationStage =
    | "send-money"
    | "confirm-details"
    | "transaction-success"
    | "transaction-failed";

// const countries = allCountryNames.map((c) => c.)
export function FxProceedModal({
    modalOpen,
    close,
    gateway,
    banks,
    currencies,
    recipientDetails,
    destinationDetails,
    sourceDetails,
    sourceAmount,
    currencyRate,
    purposes,
    destinationAmount,
    sourceCurrency,
    destinationAccCurrency
}: SendMoneyProps) {
    // const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    // const [sourceOfFundFile, setSourceOfFundFile] = useState<File | null>(null);
    // console.log({sourceDetails},'fx source in fx modal');
    // console.log({destinationDetails},'fx destinatin in fx modal');

    // const source = useMemo(() => {},[])
    const [form, setForm] = useState<"send-money" | FxTransferOperationStage>(
        "send-money"
    );
    const [confirmationDetails, setConfirmationDetails] = useState<any>({});
    const [nameEnquiryDetails, setNameEnquiryDetails] = useState<{
        account_number: string;
        bank_code: string;
        gateway_id: string;
    } | null>(null);

    const { mutate: createFxPayout, isLoading: createFxPayoutLoading } =
        useCreateFxPayout(setForm);
    const { defaultGatewayBalance, isLoading: defaultGatewayLoading } =
        useLocalBalance();

    function getModalContent(state: "send-money" | FxTransferOperationStage) {
        switch (state) {
            case "send-money":
                return {
                    title: "Recipient Details",
                    component: SendMoneyForm,
                };
            case "confirm-details":
                return {
                    title: "Confirm the following details",
                    component: ConfirmationForm,
                };
            case "transaction-success":
                return {
                    title: null,
                    component: SuccessForm,
                };
            case "transaction-failed":
                return {
                    title: null,
                    component: FailureForm,
                };
            default:
                break;
        }
    }

    // useEffect(() => {
    //   // if(destinationDetails.currencyId && destinationDetails.value){
    //     console.log({destinationDetailsProp:destinationDetails},"destinationDetailsProp Updated");
    //   // }
    // },[destinationDetails])

    // useEffect(() => {

    //   console.log({sourceAmountProp:sourceAmount},"sourceAmountProp Updated");

    // },[sourceAmount])

    useEffect(() => {
        // if(sourceDetails.currencyId && sourceDetails.value){
        // console.log({sourceDetailsProp:sourceDetails},"sourceDetailsProp Updated");
        // }
    }, [sourceDetails]);

    const {
        data: nameEnquiryResult,
        refetch,
        isFetching: fetchingNameEnquiryDetails,
    } = useNameEnquiry(nameEnquiryDetails);

    const payRecipientForm = useForm({
        initialValues: {
            source_account: sourceDetails.currencyId,
            destination_currency: destinationDetails.currencyId,
            // bank: recipientDetails?.bank ? recipientDetails?.bank.toString() : "",
            // currency: destinationDetails.currencyId,
            amount: sourceAmount,
            account_name: recipientDetails?.account_name,
            account_number: recipientDetails?.account_number,
            narration: "",
            bank_name: "",
            purpose_of_payment: "",
            rate: currencyRate,
            country: "",
            sort_code: "",
            bic: "",
            recipient_address: "",
            city: "",
            state: "",
            zipcode: "",
            swift_code: "",

            invoice: null,
            source_of_funds: null,
        },
        validate: zodResolver(ConvertFundFxPayRecipient),
    });

    const handleFileChange = (fileKey: string, fileEvent: File) => {
        payRecipientForm.setFieldValue(`${fileKey}`, fileEvent);
        // console.log("payForm", payRecipientForm.values);
    };

    useEffect(
        function () {
            if (nameEnquiryResult?.data) {
                const name = nameEnquiryResult?.data.result ?? "";
                if (name) {
                    payRecipientForm.setFieldValue("account_name", name);
                } else {
                    payRecipientForm.setFieldValue("account_name", "");
                    payRecipientForm.setFieldError(
                        "account_name",
                        "Account Name enquiry failed,input account name"
                    );
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [nameEnquiryResult?.data]
    );

    useEffect(() => {
        if (sourceDetails?.currencyId) {
            payRecipientForm.setFieldValue(
                "source_account",
                sourceDetails.currencyId
            );
            // console.log({sourceAccD:payRecipientForm.values});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceDetails]);
    useEffect(() => {
        if (currencyRate) {
            payRecipientForm.setFieldValue("rate", currencyRate);
            // console.log({sourceAccD:payRecipientForm.values});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currencyRate]);

    useEffect(() => {
        if (destinationDetails?.currencyId) {
            payRecipientForm.setFieldValue(
                "destination_currency",
                destinationDetails.currencyId
            );
            // console.log({destCurrD:payRecipientForm.values});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destinationDetails]);

    useEffect(() => {
        if (sourceAmount) {
            payRecipientForm.setFieldValue("amount", sourceAmount);
            // console.log({sourceAmountD:payRecipientForm.values});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceAmount]);

    function handleSubmit(
        values: z.infer<typeof ConvertFundFxPayRecipient> &
            Record<string, string>
    ) {
        // console.log({ values }, "fx proceed modal values");
        // console.log({ defaultGatewayBalance });

        // if (values.amount > defaultGatewayBalance) {
        //   return showNotification({
        //     title: "Unable to perform transaction",
        //     message: `Insufficient balance`,
        //     color: "red",
        //   });
        // }

        setConfirmationDetails(values);
        setForm("confirm-details");
    }

    function handleModalClose() {
        payRecipientForm.reset();
        queryClient.removeQueries(["name-enquiry"]);
        close();
        setForm("send-money");
    }

    function handleAccountNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const number = e.target.value;

        payRecipientForm.setFieldValue("account_number", number);
        // if (number.toString().length === 10) {
        //   setNameEnquiryDetails({
        //     account_number: number,
        //     bank_code: payRecipientForm.values?.bank || 0,
        //     gateway_id: String(gateway) ?? "",
        //   });

        //   refetch();
        // }
    }

    const handlePayout = () => {
        // console.log({ confirmationDetails },'fx modal');

        createFxPayout({
            ...confirmationDetails,
            // gateway,
        });
    };

    useEffect(() => {}, [sourceAmount, sourceDetails, destinationDetails]);
    const ConfirmationForm = (
        <Stack align="center" className="w-full">
            <Warning2 size={60} />
            <Text>
            Amount:{" "}
        {/* {currencyFormatter(confirmationDetails.amount)} */}
        {currencyFormatter(sourceAmount)} {sourceCurrency} to  {currencyFormatter(destinationAmount)} {destinationAccCurrency}
            </Text>
            <Text>Recipient: {confirmationDetails.account_name}</Text>
            <Text>Receiving Account: {confirmationDetails.account_number}</Text>

            <Group grow className="w-full">
                <Button
                    className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
                    onClick={handleModalClose}
                    size="md">
                    Cancel
                </Button>
                <Button
                    className="bg-primary-100 hover:bg-primary-100"
                    loading={createFxPayoutLoading}
                    onClick={handlePayout}
                    size="md">
                    Yes, Proceed
                </Button>
            </Group>
        </Stack>
    );

    const SendMoneyForm = (
        <form
            // @ts-ignore
            onSubmit={payRecipientForm.onSubmit(handleSubmit)}
            className="flex flex-col gap-4 relative">
            {/* <LoadingOverlay visible={fetchingNameEnquiryDetails} overlayBlur={2} /> */}
            <p>Enter recipient details</p>
            {/* <Select
        size="md"
        label="Bank"
        placeholder="Select Bank"
        withAsterisk
        data={banks}
        {...payRecipientForm.getInputProps("bank")}
        // disabled={!!recipientDetails?.account_name}
      /> */}
            {/* <TextInput
        size="md"
        hidden
        // label=""
        placeholder="Currency"
        // withAsterisk
        // data={banks}
        // {...payRecipientForm.getInputProps("bank")}
        {...payRecipientForm.getInputProps("currency")}
      /> */}
            <TextInput
                size="md"
                label="Bank"
                placeholder="Bank Name"
                withAsterisk
                // data={banks}
                // {...payRecipientForm.getInputProps("bank")}
                {...payRecipientForm.getInputProps("bank_name")}
            />
            {/* <Select
        size="md"
        label="Currency"
        withAsterisk
        data={currencies}
        {...payRecipientForm.getInputProps("currency")}
        disabled
      /> */}

            <TextInput
                size="md"
                // withAsterisk
                label="Account number"
                placeholder="Enter account number"
                // {...payRecipientForm.getInputProps("account_number")}
                // disabled={!!recipientDetails?.account_number}
                onChange={handleAccountNumberChange}
            />

            <TextInput
                size="md"
                withAsterisk
                placeholder="Enter account name"
                label="Account name"
                {...payRecipientForm.getInputProps("account_name")}
                // disabled
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="Sort Code"
                label="Sort Code"
                {...payRecipientForm.getInputProps("sort_code")}
                // disabled
            />
            <Select
                data={purposes}
                label="Purpose of Payment"
                placeholder="Select Purpose of Payment"
                {...payRecipientForm.getInputProps("purpose_of_payment")}
            />
            <Select
                data={allCountries}
                label="Country"
                placeholder="Select Country"
                onChange={(val) => {
                    // console.log({ value }, "country val");
                    payRecipientForm.setFieldValue("country", val as string);
                }}
                // {...payRecipientForm.getInputProps("country")}
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="State"
                label="State"
                {...payRecipientForm.getInputProps("state")}
                // disabled
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="City"
                label="City"
                {...payRecipientForm.getInputProps("city")}
                // disabled
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="Recipient Address"
                label="Recipient Address"
                {...payRecipientForm.getInputProps("recipient_address")}
                // disabled
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="BIC"
                label="BIC"
                {...payRecipientForm.getInputProps("bic")}
                // disabled
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="Zipcode"
                label="Zipcode"
                {...payRecipientForm.getInputProps("zipcode")}
                // disabled
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="Swift Code"
                label="Swift Code"
                {...payRecipientForm.getInputProps("swift_code")}

                // disabled
            />

            <FileInput
                label="Source Of Funds"
                // description=""
                placeholder="Upload 'Source Of Funds'"
                required
                // leftIcon={<IconAt style={{ width: rem(18), height: rem(18) }} />}
                onChange={(file) => {
                    handleFileChange("source_of_funds", file!);
                }}
            />

            <FileInput
                label="Invoice Document"
                // description=""
                required
                placeholder="Upload 'Invoice Document'"
                // leftIcon={<IconAt style={{ width: rem(18), height: rem(18) }} />}

                onChange={(file) => {
                    handleFileChange("invoice", file!);
                }}
            />

            <Textarea
                label="Narration"
                required
                placeholder="Enter narration"
                {...payRecipientForm.getInputProps("narration")}
            />

            <Button
                className="bg-primary-100"
                rightIcon={<ArrowRight />}
                size="md"
                type="submit">
                Continue
            </Button>
        </form>
    );

    const FormContent = getModalContent(form);

    return (
        <section>
            <Modal
                opened={modalOpen}
                title={FormContent?.title}
                onClose={handleModalClose}
                closeOnClickOutside={false}>
                {FormContent?.component}
            </Modal>
        </section>
    );
}

const SuccessForm = (
    <Stack align="center" className="w-full">
        <DirectboxSend color="green" size={60} />
        <Text className="text-xl font-semibold font-secondary">
            Operation Successful
        </Text>
        <Text className="text-center">
            Kindly check the transactions page for the status of your
            transaction
        </Text>
    </Stack>
);

const FailureForm = (
    <Stack align="center" className="w-full">
        <Danger size={60} />
        <Text className="text-xl font-semibold font-secondary">
            Operation Not Successful
        </Text>
        <Text className="text-center">
            We were unable to proceed with this transaction, check your
            transaction list for details
        </Text>
    </Stack>
);
