import { useLocalBalance } from "@/api/hooks/balance";
import { useCreateFxPayout, useNameEnquiry } from "@/api/hooks/banks";
import { queryClient } from "@/pages/_app";
import { SUPPORTED_FILE_FORMATS } from "@/utils/constants";
import { allCountries, allCountryNames } from "@/utils/countries";
import { currencyFormatter, validateAndFormatAmount } from "@/utils/currency";
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
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { z } from "zod";
import { FxTransferOperationStage } from "./fx-forms/dollar-form";
import { CurrencyDetailType } from "@/utils/validators/interfaces";
import Cookies from "js-cookie";

export const LocalExchangePayRecipient = z.object({
    // bank: z.string().min(1, { message: "Bank name is required" }).optional(),
    // currency: z.string(),
    // source_account: z.string(),
    // destination_currency: z.string(),
    amount: z.number().gte(1, { message: "Kindly input a valid amount" }),
    account_name: z.string().min(1, { message: "Account name is required" }),
    account_number: z
        .string()
        .min(1, { message: "Account number is required" }),
    narration: z.string().min(1, { message: "Narration is required" }),
    bank_name: z.string().min(1, { message: "Bank Name is required" }),
    purpose_of_payment: z
        .string()
        .min(1, { message: "Purpose of payment is required" }),
    sort_code: z.string().optional(),
    bic: z
        .string()
        .max(11, { message: "BIC cannot be more than 11 characters" })
        .optional(),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required!" }),
    state: z.string().min(1, { message: "State is required" }),
    zipcode: z.string().min(1, { message: "zipcode is required" }),
    recipient_address: z
        .string()
        .min(1, { message: "Recipient address is required" }),
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
                message: `Invoice is required, formats are .jpeg,.jpg,.png,.pdf,.doc,.docx`,
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
    // ),
});

interface SendMoneyProps {
    modalOpen: boolean;
    close(): void;
    setShowConfirmationModal: Dispatch<SetStateAction<boolean>>;
    banks?: { label: string; value: string }[];
    currencies?: { label: string; value: string }[];
    gateway?: number | undefined;
    recipientDetails?: z.infer<typeof LocalExchangePayRecipient>;
    destinationDetails?: CurrencyDetailType;
    sourceDetails?: CurrencyDetailType;
    sourceAmount?: number;
    destinationAmount?: number;
    destinationAccCurrency?: string;
    currencyRate?: number;
    sourceCurrency?: string;
    purposes?: SelectItem[];
    isFXPayout?: boolean;
    receivingCurrency: string;
}

export type TransferOperationStage =
    | "send-money"
    | "confirm-details"
    | "transaction-success"
    | "transaction-failed";

// const countries = allCountryNames.map((c) => c.)
export function LocalProceedModal({
    modalOpen,
    close,
    gateway,
    banks,
    currencies,
    recipientDetails,
    setShowConfirmationModal,
    destinationDetails,
    receivingCurrency,
    sourceDetails,
    destinationAmount,
    sourceAmount,
    currencyRate,
    destinationAccCurrency,
    sourceCurrency,
    purposes,
    isFXPayout,
}: SendMoneyProps) {
    const [form, setForm] = useState<"send-money" | FxTransferOperationStage>(
        "send-money"
    );

    const [confirmationDetails, setConfirmationDetails] = useState<any>({});
    const [nameEnquiryDetails, setNameEnquiryDetails] = useState<{
        account_number: string;
        bank_code: string;
        gateway_id: string;
    } | null>(null);
    const [accNameEnquiry, setAccNameEnquiry] = useState<any>("");
    const [amountEnquiry, setAmountEnquiry] = useState<any>(1);
    const [accNumberEnquiry, setAccNumberEnquiry] = useState<any>("");
    const [bankEnquiry, setBankEnquiry] = useState<any>("");
    const { mutate: createFxPayout, isLoading: createFxPayoutLoading } =
        useCreateFxPayout(setForm);
    const { defaultGatewayBalance, isLoading: defaultGatewayLoading } =
        useLocalBalance();

    function getModalContent(
        state:
            | "send-money"
            | "confirm-details"
            | "transaction-success"
            | "transaction-failed"
    ) {
        switch (state) {
            case "send-money":
                return {
                    title: (
                        <h2
                            className={" text-2xl font-secondary mt-2"}
                            style={{ color: colorPrimary }}>
                            Recipient Details
                        </h2>
                    ),
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
    console.log("receiving", typeof receivingCurrency);

    const {
        data: nameEnquiryResult,
        refetch,
        isFetching: fetchingNameEnquiryDetails,
    } = useNameEnquiry(nameEnquiryDetails);

    const payRecipientForm = useForm({
        initialValues: {
            source_account: isFXPayout ? sourceDetails : sourceDetails?.value,
            destination_currency: Number(receivingCurrency),
            // bank: recipientDetails?.bank ? recipientDetails?.bank.toString() : "",
            amount: sourceAmount ?? "",
            account_name: "",
            account_number: "",
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
        validate: zodResolver(LocalExchangePayRecipient),
    });

    useEffect(() => {
        payRecipientForm.setValues({
            destination_currency: Number(receivingCurrency),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivingCurrency]);

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
        if (sourceDetails?.value) {
            payRecipientForm.setFieldValue(
                "source_account",
                sourceDetails.value
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
        // values: z.infer<typeof LocalExchangePayRecipient> & Record<string, string>
        paymentForm: z.infer<typeof LocalExchangePayRecipient> &
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
        console.log(paymentForm);

        setConfirmationDetails(paymentForm);
        // setConfirmationDetails(values);
        setForm("confirm-details");
    }

    function handleModalClose() {
        // payRecipientForm.reset();
        setShowConfirmationModal(false);
        setForm("send-money");
        // queryClient.removeQueries(["name-enquiry"]);
    }
    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";

    function handleAccountNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const number = e.target.value;
        setAccNumberEnquiry(number);
        payRecipientForm.setFieldValue("account_number", number);
        // if (number.toString().length === 10) {
        //   setNameEnquiryDetails({
        //     account_number: number,
        //     // @ts-ignore
        //     bank_code: payRecipientForm.values?.bank || 0,
        //     gateway_id: String(gateway) ?? "",
        //   });

        //   refetch();
        // }
    }

    useEffect(() => {
        setAmountEnquiry(payRecipientForm.values.amount);
    }, [payRecipientForm.values.amount]);
    useEffect(() => {
        setAccNameEnquiry(payRecipientForm.values.account_name);
    }, [payRecipientForm.values.account_name]);
    useEffect(() => {
        setBankEnquiry(payRecipientForm.values.bank_name);
    }, [payRecipientForm.values.bank_name]);
    useEffect(() => {
        setAccNumberEnquiry(payRecipientForm.values.account_number);
    }, [payRecipientForm.values.account_number]);

    const handlePayout = () => {
        createFxPayout({
            ...confirmationDetails,
            // gateway,
        });
    };
    useEffect(() => {}, [sourceAmount, sourceDetails, destinationDetails]);
    const ConfirmationForm = (
        <Stack align="center" className="w-full">
            <Warning2 size={60} />

            {isFXPayout ? (
                <>
                    <Text>
                        You are about to send:{" "}
                        {validateAndFormatAmount(amountEnquiry.toString()) ?? 0}{" "}
                        {sourceCurrency} to{" "}
                    </Text>
                    <Text>Recipient: {accNameEnquiry}</Text>
                    <Text>
                        Receiving Account: <br /> {bankEnquiry};{" "}
                        {accNumberEnquiry}
                    </Text>
                </>
            ) : (
                <>
                    <Text>
                        Amount:
                        {currencyFormatter(sourceAmount ?? 0)} {sourceCurrency}{" "}
                        to {currencyFormatter(destinationAmount ?? 0)}{" "}
                        {destinationAccCurrency}
                    </Text>
                    <Text>Recipient: {confirmationDetails.account_name}</Text>
                    <Text>
                        Receiving Account: {confirmationDetails.account_number}
                    </Text>
                </>
            )}

            <Group grow className="w-full">
                <Button
                    className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
                    onClick={() => setForm("send-money")}
                    size="md">
                    Back
                </Button>
                <Button
                    style={{ backgroundColor: colorBackground }}
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
            <TextInput
                size="md"
                label="Bank"
                placeholder="Bank Name"
                withAsterisk
                required
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
                withAsterisk
                required
                label="Account number"
                placeholder="Enter account number"
                {...payRecipientForm.getInputProps("account_number")}
            />

            <TextInput
                size="md"
                withAsterisk
                placeholder="Enter account name"
                label="Account name"
                required
                {...payRecipientForm.getInputProps("account_name")}

                // disabled
            />
            {isFXPayout && (
                <NumberInput
                    size="md"
                    label="Amount"
                    placeholder="Amount"
                    withAsterisk
                    {...payRecipientForm.getInputProps("amount")}
                />
            )}

            <TextInput
                size="md"
                // withAsterisk
                placeholder="Sort Code"
                label="Sort Code"
                {...payRecipientForm.getInputProps("sort_code")}
                // disabled
            />
            <Select
                //@ts-ignore
                data={purposes}
                required
                label="Purpose of Payment"
                placeholder="Select Purpose of Payment"
                {...payRecipientForm.getInputProps("purpose_of_payment")}
            />

            <Select
                data={allCountries}
                label="Country"
                placeholder="Select Country"
                required
                withAsterisk
                {...payRecipientForm.getInputProps("country")}
            />
            <TextInput
                size="md"
                withAsterisk
                placeholder="State"
                label="State"
                {...payRecipientForm.getInputProps("state")}
                // disabled
            />
            <TextInput
                size="md"
                withAsterisk
                placeholder="City"
                label="City"
                {...payRecipientForm.getInputProps("city")}
                // disabled
            />
            <TextInput
                size="md"
                withAsterisk
                placeholder="Recipient Address"
                label="Recipient Address"
                {...payRecipientForm.getInputProps("recipient_address")}
            />
            <TextInput
                size="md"
                // withAsterisk
                placeholder="BIC"
                label="BIC"
                {...payRecipientForm.getInputProps("bic")}
            />
            <TextInput
                size="md"
                withAsterisk
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
                placeholder="Upload 'Source Of Funds'"
                required
                error={
                    !payRecipientForm.values.source_of_funds
                        ? "Source of Fund file is required."
                        : ""
                }
                {...payRecipientForm.getInputProps("source_of_funds")}
            />

            <FileInput
                label="Invoice Document"
                // description=""
                required
                error={
                    !payRecipientForm.values.invoice
                        ? "Invoice file is required."
                        : ""
                }
                placeholder="Upload 'Invoice Document'"
                {...payRecipientForm.getInputProps("invoice")}
            />

            <Textarea
                label="Narration"
                required
                placeholder="Enter narration"
                {...payRecipientForm.getInputProps("narration")}
            />

            <Button
                style={{ backgroundColor: colorBackground }}
                rightIcon={<ArrowRight />}
                size="md"
                type="submit"
                // onClick={()=>handleSubmit(payRecipientForm.values)}
            >
                Continue
            </Button>
        </form>
    );

    const FormContent = getModalContent(form);

    return (
        <section>
            <Modal
                closeOnClickOutside={false}
                opened={modalOpen}
                title={FormContent?.title}
                onClose={handleModalClose}>
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
