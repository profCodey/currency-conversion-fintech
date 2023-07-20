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
import { ReactNode, useState } from "react";
import { z } from "zod";
import { ConfirmationForm, FailureForm, SuccessForm } from "../send-fx-modal";
import { showNotification } from "@mantine/notifications";

export const PoundFormValidator = z.object({
  amount: z.number().gte(1, "Enter valid amount"),
  account_name: z.string().min(1, { message: "Account name is required" }),
  account_number: z.string().min(1, { message: "Account number is required" }),
  bank_name: z.string().min(1, { message: "Bank name is required" }),
  sort_code: z.string().min(1, { message: "Sort code is required" }),
  narration: z.string().min(1, { message: "Narration is required" }),
  source_account: z.number(),
});

export type FxTransferOperationStage =
  | "confirm-details"
  | "transaction-success"
  | "transaction-failed";

export function PoundForm({
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
  const PoundForm = useForm({
    initialValues: {
      amount: 0,
      account_name: recipientDetails?.account_name || "",
      account_number: recipientDetails?.account_number || "",
      bank_name: recipientDetails?.fx_bank_name || "",
      sort_code: recipientDetails?.sort_code || "",
      source_account: account?.id as number,
    },
    validate: zodResolver(PoundFormValidator),
  });

  function handleSubmit() {
    if (PoundForm.values.amount > Number(account?.true_balance)) {
      return showNotification({
        title: "Unable to perform transaction",
        message: `Amount cannot be greater than £${account?.true_balance}`,
        color: "red"
      });
    }
    setForm("confirm-details");
  }

  function handleSuccess() {
    setForm(null);
    handleFormClose();
  }

  return (
    <>
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={PoundForm.onSubmit(handleSubmit)}
      >
        <NumberInput
          size="md"
          label={
            <Group position="apart" className="w-full font-normal">
              <span>Enter ammount</span>
              <span className="text-sm text-red-600 font-semibold">
                Balance: £{account?.true_balance}
              </span>
            </Group>
          }
          labelProps={{ className: "w-full" }}
          placeholder="Enter amount"
          hideControls={false}
          withAsterisk={false}
          parser={(value: string) => value.replace(/\£\s?|(,*)/g, "")}
          formatter={(value: string) =>
            !Number.isNaN(parseFloat(value))
              ? `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : `£ `
          }
          {...PoundForm.getInputProps("amount")}
          min={1}
        />

        <TextInput
          label="Bank name"
          placeholder="Bank name"
          size="md"
          {...PoundForm.getInputProps("bank_name")}
        />

        <TextInput
          label="Account number"
          placeholder="Account number"
          size="md"
          {...PoundForm.getInputProps("account_number")}
        />

        <TextInput
          label="Account name"
          aria-label="Account name"
          placeholder="Account name"
          size="md"
          {...PoundForm.getInputProps("account_name")}
        />

        <TextInput
          label="Sort code"
          aria-label="Sort code"
          placeholder="Sort code"
          size="md"
          {...PoundForm.getInputProps("sort_code")}
        />

        <Textarea
          label="Narration"
          placeholder="Enter narration"
          size="md"
          {...PoundForm.getInputProps("narration")}
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
            PoundForm.reset();
            handleFormClose();
          }
          setForm(null);
        }}
        zIndex={500}
        transitionProps={{ transition: "slide-left" }}
      >
        {form === "confirm-details" && (
          <ConfirmationForm
            confirmation_details={PoundForm.values}
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
