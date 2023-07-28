import { useCreateFxPayout } from "@/api/hooks/banks";
import { useGetCurrentUser } from "@/api/hooks/user";
import { IAccount, IRecipient } from "@/utils/validators/interfaces";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";
import { ConfirmationForm, FailureForm, SuccessForm } from "../send-fx-modal";
import { useGetFxAccounts } from "@/api/hooks/fx";
import { useFxBalance } from "@/api/hooks/balance";
import { showNotification } from "@mantine/notifications";

export const DollarFormValidator = z.object({
  amount: z.number().gte(1, "Enter valid amount"),
  account_name: z.string().min(1, { message: "Account name is required" }),
  account_number: z.string().min(1, { message: "Account number is required" }),
  bank_name: z.string().min(1, { message: "Bank name is required" }),
  bic: z.string().min(1, { message: "BIC is required" }),
  recipient_address: z
    .string()
    .min(1, { message: "Recipient address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipcode: z.string().min(1, { message: "Zipcode is required" }),
  narration: z.string().min(1, { message: "Narration is required" }),
  source_account: z.number(),
});

export type FxTransferOperationStage =
  | "confirm-details"
  | "transaction-success"
  | "transaction-failed";

export function DollarForm({
  recipientDetails,
  handleFormClose,
  account,
}: {
  recipientDetails: IRecipient;
  handleFormClose(): void;
  account: IAccount | undefined;
}) {
  const [form, setForm] = useState<FxTransferOperationStage | null>(null);
  const { mutate: createPayout, isLoading: createPayoutLoading } =
    useCreateFxPayout(setForm);
  const DollarForm = useForm({
    initialValues: {
      amount: 0,
      account_name: recipientDetails?.account_name || "",
      account_number: recipientDetails?.account_number || "",
      bank_name: recipientDetails?.fx_bank_name || "",
      bic: recipientDetails?.bic || "",
      recipient_address: recipientDetails?.recipient_address || "",
      city: recipientDetails?.city || "",
      state: recipientDetails?.state || "",
      zipcode: recipientDetails?.zipcode || "",
      narration: "",
      source_account: account?.id as number,
    },
    validate: zodResolver(DollarFormValidator),
  });

  function handleSubmit() {
    if (DollarForm.values.amount > Number(account?.true_balance)) {
      return showNotification({
        title: "Unable to perform transaction",
        message: `Insufficient balance`,
        color: "red",
      });
    }
    setForm("confirm-details");
  }

  // function handleSuccess() {
  //   setForm(null);
  //   handleFormClose();
  // }

  return (
    <>
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={DollarForm.onSubmit(handleSubmit)}
      >
        <NumberInput
          size="md"
          label={
            <Group position="apart" className="w-full font-normal">
              <span>Enter ammount</span>{" "}
              <span className="text-sm text-red-600 font-semibold">
                Balance: ${account?.true_balance}
              </span>
            </Group>
          }
          labelProps={{ className: "w-full" }}
          placeholder="Enter amount"
          hideControls={false}
          withAsterisk={false}
          parser={(value: string) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value: string) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : `$ `
          }
          {...DollarForm.getInputProps("amount")}
          min={1}
        />

        <TextInput
          label="Bank name"
          placeholder="Bank name"
          size="md"
          {...DollarForm.getInputProps("bank_name")}
        />

        <TextInput
          label="Account number"
          placeholder="Account number"
          size="md"
          {...DollarForm.getInputProps("account_number")}
        />

        <TextInput
          label="Account name"
          aria-label="Account name"
          placeholder="Account name"
          size="md"
          {...DollarForm.getInputProps("account_name")}
        />

        <TextInput
          label="BIC"
          aria-label="bic"
          placeholder="BIC"
          size="md"
          {...DollarForm.getInputProps("bic")}
        />

        <TextInput
          label="Recipient address"
          aria-label="recipient_address"
          placeholder="Recipient Address"
          size="md"
          {...DollarForm.getInputProps("recipient_address")}
        />

        <TextInput
          label="City"
          aria-label="city"
          placeholder="City"
          size="md"
          {...DollarForm.getInputProps("city")}
        />

        <TextInput
          label="State"
          aria-label="state"
          placeholder="State"
          size="md"
          {...DollarForm.getInputProps("state")}
        />

        <TextInput
          label="Zip code"
          aria-label="zip code"
          placeholder="Zip code"
          size="md"
          {...DollarForm.getInputProps("zipcode")}
        />

        <Textarea
          label="Narration"
          placeholder="Enter narration"
          size="md"
          {...DollarForm.getInputProps("narration")}
        />
        <Button
          type="submit"
          size="md"
          className="bg-[#132144] hover:bg-[#00B0F0] transition-colors duration-500"
        >
          Continue
        </Button>
      </form>

      <Modal
        opened={!!form}
        onClose={() => {
          if (form === "transaction-success") {
            DollarForm.reset();
            handleFormClose();
          }
          setForm(null);
        }}
        zIndex={500}
        transitionProps={{ transition: "slide-left" }}
      >
        {form === "confirm-details" && (
          <ConfirmationForm
            confirmation_details={DollarForm.values}
            buttonLoading={createPayoutLoading}
            handleClose={() => setForm(null)}
            handleSend={createPayout}
          />
        )}
        {form === "transaction-success" && <SuccessForm />}
        {form === "transaction-failed" && <FailureForm />}
      </Modal>
    </>
  );
}
