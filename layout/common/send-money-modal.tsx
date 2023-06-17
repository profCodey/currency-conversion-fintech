import { useCreatePayout } from "@/api/hooks/banks";
import {
  Button,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals, modals } from "@mantine/modals";
import { ArrowRight } from "iconsax-react";
import { z } from "zod";

const PayRecipient = z.object({
  bank: z.string().min(1, { message: "Bank name is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  amount: z.number().gte(10),
  account_name: z.string().min(1, { message: "Account name is required" }),
  account_number: z.string().min(1, { message: "Account number is required" }),
  narration: z.string().min(1, { message: "Narration is required" }),
});

interface SendMoneyProps {
  modalOpen: boolean;
  close(): void;
  banks: { label: string; value: string }[];
  currencies: { label: string; value: string }[];
  gateway: number | undefined;
  recipientDetails: z.infer<typeof PayRecipient>;
}

export function SendMoneyModal({
  modalOpen,
  close,
  gateway,
  banks,
  currencies,
  recipientDetails,
}: SendMoneyProps) {
  const { mutate: createPayout, isLoading: createPayoutLoading } =
    useCreatePayout(() => closeAllModals());
  const payRecipientForm = useForm({
    initialValues: {
      bank: recipientDetails?.bank.toString(),
      currency: recipientDetails?.currency,
      amount: 1000,
      account_name: recipientDetails?.account_name,
      account_number: recipientDetails?.account_number,
      narration: "",
    },
    validate: zodResolver(PayRecipient),
  });

  function handleSubmit(values: z.infer<typeof PayRecipient>) {
    close();

    modals.openConfirmModal({
      title: "Please confirm the following details",
      children: (
        <>
          <Text>Amount: {values.amount}</Text>
          <Text>Recipient: {values.account_name}</Text>
          <Text>Receiving Account: {values.account_number}</Text>
        </>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: {
        className: "bg-primary-100",
        loading: createPayoutLoading,
      },
      onCancel: () => closeAllModals(),
      onConfirm: () =>
        createPayout({
          amount: values.amount,
          narration: values.narration,
          account_number: values.account_number,
          bank: values.bank,
          gateway: gateway as number,
        }),
    });
  }

  return (
    <Modal opened={modalOpen} title="Recipient Details" onClose={close}>
      <form
        onSubmit={payRecipientForm.onSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <p>Enter recipient details</p>
        <Select
          size="md"
          label="Bank"
          data={banks}
          {...payRecipientForm.getInputProps("bank")}
          disabled
        />
        <Select
          size="md"
          label="Currency"
          data={currencies}
          {...payRecipientForm.getInputProps("currency")}
          disabled
        />
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
          {...payRecipientForm.getInputProps("amount")}
        />

        <TextInput
          size="md"
          label="Account name"
          {...payRecipientForm.getInputProps("account_name")}
          disabled
        />
        <TextInput
          size="md"
          label="Account number"
          {...payRecipientForm.getInputProps("account_number")}
          disabled
        />

        <Textarea
          label="Narration"
          placeholder="Enter narration"
          {...payRecipientForm.getInputProps("narration")}
        />

        <Button
          className="bg-primary-100"
          rightIcon={<ArrowRight />}
          size="md"
          type="submit"
        >
          Continue
        </Button>
      </form>
    </Modal>
  );
}
