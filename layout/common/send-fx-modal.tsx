import { currencyFormatter } from "@/utils/currency";
import { IRecipient } from "@/utils/validators/interfaces";
import {
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { Danger, DirectboxSend, Warning2 } from "iconsax-react";
import { useState } from "react";
import { z } from "zod";
import { DollarForm } from "./fx-forms/dollar-form";
import { PoundForm } from "./fx-forms/pound-form";
import { useGetFxAccounts } from "@/api/hooks/fx";
import { EuroForm } from "./fx-forms/euro-form";

export const PayFxRecipient = z.object({
  //   bank: z.string().min(1, { message: "Bank name is required" }),
  // currency: z.string().min(1, { message: "Currency is required" }),
  amount: z.number().gte(1, "Enter valid amount"),
  account_name: z.string().min(1, { message: "Account name is required" }),
  account_number: z
    .string()
    .min(1, { message: "Account number is required" })
    .optional(),
  narration: z.string().min(1, { message: "Narration is required" }).optional(),
  bank_name: z.string().min(1, { message: "Bank name is required" }),
  sort_code: z.string().min(1, { message: "Sort code is required" }).optional(),
  bic: z.string().min(1, { message: "BIC is required" }).optional(),
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
  const [currentForm, setCurrentForm] = useState<"USD" | "GBP" | "EUR">("USD");

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
        position="right"
      >
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
      Kindly check the transactions page for the status of your transaction
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
  return (
    <Stack align="center" className="w-full">
      <Warning2 size={60} />
      <Text>Amount: ₦{currencyFormatter(confirmation_details.amount)}</Text>
      <Text>Recipient: {confirmation_details.account_name}</Text>
      <Text>
        Receiving Account:{" "}
        {confirmation_details?.account_number || confirmation_details?.iban}{" "}
        {confirmation_details.bank_name}
      </Text>

      <Group grow className="w-full">
        <Button
          className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
          onClick={() => handleClose()}
          size="md"
        >
          Cancel
        </Button>
        <Button
          className="bg-primary-100 hover:bg-primary-100"
          loading={buttonLoading}
          onClick={() => {
            handleSend(confirmation_details as z.infer<typeof PayFxRecipient>);
          }}
          size="md"
        >
          Yes, Proceed
        </Button>
      </Group>
    </Stack>
  );
};
