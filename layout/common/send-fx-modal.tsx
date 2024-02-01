import { currencyFormatter } from "@/utils/currency";
import { IRecipient } from "@/utils/validators/interfaces";
import {
    Button,
    Divider,
    Drawer,
    Group,
    LoadingOverlay,
    Modal,
    Select,
    Skeleton,
    Stack,
    Text,
} from "@mantine/core";
import { ArrowRight, Danger, DirectboxSend, Warning2 } from "iconsax-react";
import { useState } from "react";
import { z } from "zod";
import { DollarForm } from "./fx-forms/dollar-form";
import { PoundForm } from "./fx-forms/pound-form";
import { useGetFxAccounts } from "@/api/hooks/fx";
import { EuroForm } from "./fx-forms/euro-form";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { SendMoneyModal } from "./send-money-modal";
import { useBankOptions } from "@/api/hooks/banks";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { PayRecipient } from "../recipients/recipient-list";
import { useGetVirtualAccount } from "@/api/hooks/accounts";
import { FXProceedModal } from "./fx-proceed-modal";
import { useGetFxPurposes } from "@/api/hooks/fx";
import { useGetCurrentUser } from "@/api/hooks/user";
import { useGetAccounts } from "@/api/hooks/accounts";
import { ExchangeBox } from "../dashboard/exchange-box";
import { useFXWalletAccounts } from "@/api/hooks/accounts";
import Cookies from "js-cookie";
import LocalExchangeModal from "../dashboard/local-exchange-modal";
import { FxManualFunding } from "../fund-account/fx";
import { LocalManualFunding } from "../fund-account/local";

export const PayFxRecipient = z.object({
    //   bank: z.string().min(1, { message: "Bank name is required" }),
    // currency: z.string().min(1, { message: "Currency is required" }),
    amount: z.number().gte(1, "Enter valid amount"),
    account_name: z.string().min(1, { message: "Account name is required" }),
    account_number: z
        .string()
        .min(1, { message: "Account number is required" })
        .optional(),
    narration: z
        .string()
        .min(1, { message: "Narration is required" })
        .optional(),
    bank_name: z.string().min(1, { message: "Bank name is required" }),
    sort_code: z
        .string()
        .min(1, { message: "Sort code is required" })
        .optional(),
    bic: z
        .string()
        .max(11, { message: "BIC cannot be more than 11 characters" })
        .optional(),
    iban: z.string().min(1, { message: "IBAN is required" }).optional(),
    recipient_address: z
        .string()
        .min(1, { message: "Recipient address is required" })
        .optional(),
    city: z.string().min(1, { message: "City is required" }).optional(),
    state: z.string().min(1, { message: "State is required" }).optional(),
    zipcode: z.string().min(1, { message: "Zipcode is required" }).optional(),
    source_account: z.number().optional(),
    bank: z.string().optional(),
});

interface SendMoneyProps {
    modalOpen: boolean;
    close(): void;
    recipientDetails: IRecipient;
}

export type TransferOperationStage =
    | "send-money"
    | "confirm-details"
    | "transaction-success"
    | "transaction-failed";

export function SendFxMoneyModal({
    modalOpen,
    close,
    recipientDetails,
}: SendMoneyProps) {
    const { fxAccounts, isLoading } = useGetFxAccounts();
    const [currentForm, setCurrentForm] = useState<"USD" | "GBP" | "EUR">(
        "USD"
    );

    const dollarAccount = fxAccounts?.find(
        (account) => account.currency.code === "USD"
    );
    const gbpAccount = fxAccounts?.find(
        (account) => account.currency.code === "GBP"
    );
    const euroAccount = fxAccounts?.find(
        (account) => account.currency.code === "EUR"
    );

    function handleModalClose() {
        close();
    }

    return (
        <section>
            <Drawer
                opened={modalOpen}
                title="Transfer to recipient"
                onClose={handleModalClose}
                position="right">
                {isLoading ? (
                    <Skeleton className="h-full min-h-[70vh]" />
                ) : (
                    <>
                        <Select
                            label="Select currency  "
                            aria-label="Currency"
                            data={[
                                { label: "USD", value: "USD" },
                                { label: "Pounds", value: "GBP" },
                                { label: "Euro", value: "EUR" },
                            ]}
                            // disabled={!!recipientDetails?.id}
                            size="md"
                            value={currentForm}
                            onChange={(value) => {
                                setCurrentForm(value as "USD" | "GBP" | "EUR");
                            }}
                        />
                        {currentForm === "USD" && (
                            <DollarForm
                                recipientDetails={recipientDetails}
                                handleFormClose={handleModalClose}
                                account={dollarAccount}
                            />
                        )}

                        {currentForm === "GBP" && (
                            <PoundForm
                                recipientDetails={recipientDetails}
                                handleFormClose={handleModalClose}
                                account={gbpAccount}
                            />
                        )}

                        {currentForm === "EUR" && (
                            <EuroForm
                                recipientDetails={recipientDetails}
                                handleFormClose={handleModalClose}
                                account={euroAccount}
                            />
                        )}
                    </>
                )}
            </Drawer>
        </section>
    );
}

export const SuccessForm = () => (
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

export const FailureForm = () => (
    <Stack align="center" className="w-full">
        <Danger size={60} />
        <Text className="text-xl font-semibold font-secondary">
            Operation Not Successful
        </Text>
        <Text className="text-center">
            We were unable to proceed with this transaction, check your log for
            details
        </Text>
    </Stack>
);

export const ConfirmationForm = ({
    confirmation_details,
    handleClose,
    handleSend,
    buttonLoading,
}: {
    confirmation_details: z.infer<typeof PayFxRecipient>;
    handleClose(): void;
    handleSend(arg0: z.infer<typeof PayFxRecipient>): void;
    buttonLoading: boolean;
}) => {
    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";
    return (
        <Stack align="center" className="w-full">
            <Warning2 size={60} />
            <Text>
                Amount: ₦{currencyFormatter(confirmation_details.amount)}
            </Text>
            <Text>Recipient: {confirmation_details.account_name}</Text>
            <Text>
                Receiving Account:{" "}
                {confirmation_details?.account_number ||
                    confirmation_details?.iban}{" "}
                {confirmation_details.bank_name}
            </Text>

            <Group grow className="w-full">
                <Button
                    className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
                    onClick={() => handleClose()}
                    size="md">
                    Cancel
                </Button>
                <Button
                    style={{ backgroundColor: colorBackground }}
                    loading={buttonLoading}
                    onClick={() => {
                        handleSend(
                            confirmation_details as z.infer<
                                typeof PayFxRecipient
                            >
                        );
                    }}
                    size="md">
                    Yes, Proceed
                </Button>
            </Group>
        </Stack>
    );
};

interface FxOptionsModalProps {
    title?: string;
    close: () => void;
    optionsOpen: boolean;
    local?: boolean;
    id?: number;
}

export const FxOptionsModal = ({
    title,
    close,
    optionsOpen,
    id,
}: FxOptionsModalProps) => {
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const { fxPurposes, isLoading: isLoadingPurpose } = useGetFxPurposes();
    const [showManualFundingOpen, setShowManualFundingOpen] = useState(false);
    const { isLoading, data: userInfo } = useGetCurrentUser();
    const { isLoading: walletsLoading, data: wallets } = useGetAccounts();
    const wallet = wallets?.data.find((wallet) => {
        return wallet.id === id;
    });

    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";
    function handleSendMoneyOpen() {
        setShowConfirmationModal(true);
    }

    function handleSendExchangeOpen() {
        setShowExchangeModal(true);
    }

    function closeExchageModal() {
        setShowExchangeModal(false);
    }

    function handleManualFundingOpen() {
        setShowManualFundingOpen(true);
    }

    function closeManualFundingModal() {
        setShowManualFundingOpen(false);
    }

    return (
        <>
            <Modal
                opened={optionsOpen}
                onClose={close}
                title={
                    <h2
                        className={" text-2xl font-secondary"}
                        style={{ color: colorPrimary }}>
                        Send ${title}
                    </h2>
                }
                centered>
                <div
                    style={{ cursor: "pointer" }}
                    className="flex items-center justify-between mb-3"
                    onClick={handleSendMoneyOpen}>
                    <div style={{ color: colorSecondary }}>
                        <h3 className="text-2xl font-semibold"> Send Fund </h3>
                        <span
                            className="text-sm font-normal "
                            style={{ color: colorPrimary }}>
                            Send to foreign account{" "}
                        </span>
                    </div>
                    <ArrowRight />
                </div>
                <Divider my="sm" />
                <div
                    style={{ cursor: "pointer", color: colorSecondary }}
                    className="flex items-center justify-between mb-3"
                    onClick={handleSendExchangeOpen}>
                    <div>
                        <h3 className="text-2xl font-semibold">
                            {" "}
                            Convert Fund{" "}
                        </h3>
                        <span
                            className="text-sm font-normal "
                            style={{ color: colorPrimary }}>
                            Convert to other currencies{" "}
                        </span>
                    </div>
                    <ArrowRight />
                </div>
                <Divider my="sm" />
                <Link
                    className="flex items-center justify-between mb-3"
                    href="/transactions">
                    <div style={{ color: colorSecondary }}>
                        <h3 className="text-2xl font-semibold">
                            {" "}
                            Transaction{" "}
                        </h3>
                        <span
                            className="text-sm font-normal "
                            style={{ color: colorPrimary }}>
                            View all transactions{" "}
                        </span>
                    </div>
                    <ArrowRight />
                </Link>
                <Divider my="sm" />

                <div
                    style={{ cursor: "pointer", color: colorSecondary }}
                    className="flex items-center justify-between mb-3"
                    onClick={handleManualFundingOpen}>
                    <div>
                        <h3 className="text-2xl font-semibold">
                            {" "}
                            Manual Funding{" "}
                        </h3>
                        <span
                            className="text-sm font-normal"
                            style={{ color: colorPrimary }}>
                            Click here to manually find your account
                        </span>
                    </div>
                    <ArrowRight />
                </div>
            </Modal>
            <FXProceedModal
                modalOpen={showConfirmationModal}
                close={() => setShowConfirmationModal(false)}
                sourceAmount={0}
                currencyRate={0}
                destinationAmount={0}
                sourceCurrency={wallet?.currency.name}
                destinationAccCurrency={""}
                purposes={fxPurposes}
                isFXPayout={true}
                //@ts-ignore
                sourceDetails={wallet?.id}
                //@ts-ignore
                destinationDetails={wallet?.currency.id}
            />
            <Modal
                opened={showExchangeModal}
                onClose={closeExchageModal}
                title={
                    <h2
                        className={"text-2xl font-secondary mt-2"}
                        style={{ color: colorPrimary }}>
                        Send ${title}
                    </h2>
                }
                centered>
                <div className="z-100">
                    <ExchangeBox gatewayID={id} />
                </div>
            </Modal>
            <Modal
                opened={showManualFundingOpen}
                onClose={closeManualFundingModal}
                title={
                    <h2
                        className={" text-2xl font-secondary"}
                        style={{ color: colorPrimary }}>
                        Fund your wallet
                    </h2>
                }
                centered>
                <div className="z-100">
                    <FxManualFunding gatewayID={id} closeModal={closeManualFundingModal} />
                 </div>
            </Modal>
        </>
    );
};
export const NairaOptionsModal = ({
    close,
    optionsOpen,
    id,
}: FxOptionsModalProps) => {
    const { data: fxData } = useFXWalletAccounts();
    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";
    const [opened, { open, close: closeModal }] = useDisclosure(false);
    const { data: virtualAccount } = useGetVirtualAccount(String(id));
    const { bankOptions } = useBankOptions();
    const [showNgnModalOpen, setShowNgnModalOpen] = useState(false);
    const [showManualFundingOpen, setShowManualFundingOpen] = useState(false);
    const { currencyOptions } = useCurrencyOptions();
    const { defaultGateway } = useDefaultGateway();
    const [recipientDetails, setRecipientDetails] = useState<
        z.infer<typeof PayRecipient>
    >({
        bank: "",
        currency: "NGN",
        amount: 1000,
        account_name: "",
        account_number: "",
        narration: "",
    });

    function handleNgnExchangeOpen() {
        setShowNgnModalOpen(true);
    }

    function closeNgnExchangeModal() {
        setShowNgnModalOpen(false);
    }

    function handleManualFundingOpen() {
        setShowManualFundingOpen(true);
    }

    function closeManualFundingModal() {
        setShowManualFundingOpen(false);
    }

    return (
        <>
            <Modal
                opened={optionsOpen}
                onClose={close}
                title={
                    <h2
                        className={" text-2xl font-secondary"}
                        style={{ color: colorPrimary }}>
                        Naira exchange
                    </h2>
                }
                centered>
                <section className="flex items-center justify-between mb-3">
                    <div className="w-full" style={{ color: colorSecondary }}>
                        <h3 className="text-lg font-medium mb-2">
                            {" "}
                            Your Virtual Account is:{" "}
                        </h3>
                        <div className="flex flex-col align-center text-black justify-center w-100">
                            <div className="mb-[-3px] flex">
                                <div
                                    className="text-sm font-medium w-1/3"
                                    style={{ color: colorPrimary }}>
                                    Account Name:{" "}
                                </div>
                                <div
                                    className="text-sm font-normal"
                                    style={{ color: colorPrimary }}>
                                    {" "}
                                    {virtualAccount?.data.account_name}{" "}
                                </div>
                            </div>
                            <div className="mb-[-3px] flex">
                                <div
                                    className="text-sm font-medium w-1/3"
                                    style={{ color: colorPrimary }}>
                                    Bank Name:{" "}
                                </div>
                                <div
                                    className="text-sm font-normal"
                                    style={{ color: colorPrimary }}>
                                    {" "}
                                    {virtualAccount?.data.bank_name}{" "}
                                </div>
                            </div>
                            <div className="mb-[-3px] flex">
                                <div
                                    className="text-sm font-medium w-1/3"
                                    style={{ color: colorPrimary }}>
                                    Account Number:{" "}
                                </div>
                                <div
                                    className="text-sm font-normal"
                                    style={{ color: colorPrimary }}>
                                    {" "}
                                    {virtualAccount?.data.account_number}{" "}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Divider my="sm" />
                {fxData?.data &&
                "use_fx_wallet" in fxData?.data &&
                fxData?.data.use_fx_wallet ? (
                    <></>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-red-600 ">
                                <h3 className="text-lg font-medium mb-1">
                                    {" "}
                                    Please Note!!!{" "}
                                </h3>
                                <span className="text-sm font-medium">
                                    Any funds sent to the account number
                                    provided must be utilized by the end of the
                                    day. If not spent, you have the option to
                                    withdraw them to your Naira account. Failure
                                    to withdraw the funds will result in an
                                    automatic transfer overnight, incurring an
                                    additional charge of ₦10,000{" "}
                                </span>
                            </div>
                        </div>
                        <Divider my="sm" />
                    </>
                )}
                <div
                    role="button"
                    className="flex items-center justify-between mb-3"
                    onClick={open}>
                    <div style={{ color: colorSecondary }}>
                        <h3 className="text-2xl font-semibold">
                            {" "}
                            Withdraw Fund{" "}
                        </h3>
                        <span
                            className="text-sm font-normal"
                            style={{ color: colorPrimary }}>
                            Withdraw to local account{" "}
                        </span>
                    </div>
                    <ArrowRight />
                </div>
                <Divider my="sm" />

                <div
                    style={{ cursor: "pointer", color: colorSecondary }}
                    className="flex items-center justify-between mb-3"
                    onClick={handleNgnExchangeOpen}>
                    <div>
                        <h3 className="text-2xl font-semibold"> Exchange </h3>
                        <span
                            className="text-sm font-normal"
                            style={{ color: colorPrimary }}>
                            {" "}
                            Exchange NGN to other currencies{" "}
                        </span>
                    </div>
                    <ArrowRight />
                </div>
                <Divider my="sm" />

                <div
                    style={{ cursor: "pointer", color: colorSecondary }}
                    className="flex items-center justify-between mb-3"
                    onClick={handleManualFundingOpen}>
                    <div>
                        <h3 className="text-2xl font-semibold">
                            {" "}
                            Manual Funding{" "}
                        </h3>
                        <span
                            className="text-sm font-normal"
                            style={{ color: colorPrimary }}>
                            Click here to manually find your account
                        </span>
                    </div>
                    <ArrowRight />
                </div>
            </Modal>
            <SendMoneyModal
                modalOpen={opened}
                close={closeModal}
                banks={bankOptions}
                currencies={currencyOptions}
                gateway={defaultGateway?.gateway}
                recipientDetails={recipientDetails}
            />
            <Modal
                opened={showNgnModalOpen}
                onClose={closeNgnExchangeModal}
                size={500}
                title={
                    <h2
                        className={" text-2xl font-secondary"}
                        style={{ color: colorPrimary }}>
                        Exchange your fund
                    </h2>
                }
                centered>
                <div className="z-100">
                    <LocalExchangeModal gatewayID={id} />
                </div>
            </Modal>
            <Modal
                opened={showManualFundingOpen}
                onClose={closeManualFundingModal}
                size={500}
                title={
                    <h2
                        className={" text-2xl font-secondary"}
                        style={{ color: colorPrimary }}>
                        Fund your wallet
                    </h2>
                }
                centered>
                <div className="z-100">
                    <LocalManualFunding gatewayID={id} closeModal={closeManualFundingModal} />
                </div>
            </Modal>
        </>
    );
};
