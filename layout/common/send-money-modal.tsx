import { useCreatePayout, useNameEnquiry } from "@/api/hooks/banks";
import { queryClient } from "@/pages/_app";
import { currencyFormatter } from "@/utils/currency";
import {
  Button,
  LoadingOverlay,
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
import { useEffect, useState } from "react";
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
  const [nameEnquiryDetails, setNameEnquiryDetails] = useState<{
    account_number: string;
    bank_code: string;
    gateway_id: string;
  } | null>(null);
  const { mutate: createPayout, isLoading: createPayoutLoading } =
    useCreatePayout(() => closeAllModals());

  const {
    data: nameEnquiryResult,
    refetch,
    isFetching: fetchingNameEnquiryDetails,
  } = useNameEnquiry(nameEnquiryDetails);

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

  useEffect(
    function () {
      if (nameEnquiryResult?.data) {
        const name = nameEnquiryResult?.data.result ?? "";
        if (name) {
          payRecipientForm.setFieldValue("account_name", name);
        } else {
          payRecipientForm.setFieldValue("account_name", "");
          payRecipientForm.setFieldError("account_name", "Name enquiry failed");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nameEnquiryResult?.data]
  );

  function handleSubmit(values: z.infer<typeof PayRecipient>) {
    close();

    modals.openConfirmModal({
      title: "Please confirm the following details",
      children: (
        <>
          <Text>Amount: ₦{currencyFormatter(values.amount)}</Text>
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

  function handleAccountNumberChange(number: string) {
    payRecipientForm.setFieldValue("account_number", number);
    if (number.toString().length === 10) {
      setNameEnquiryDetails({
        account_number: number,
        bank_code: payRecipientForm.values.bank,
        gateway_id: String(gateway) ?? "",
      });

      refetch();
    }
  }

  function handleModalClose() {
    payRecipientForm.reset();
    queryClient.removeQueries(["name-enquiry"]);
    close();
  }

  return (
    <Modal
      opened={modalOpen}
      title="Recipient Details"
      onClose={handleModalClose}
    >
      <form
        onSubmit={payRecipientForm.onSubmit(handleSubmit)}
        className="flex flex-col gap-4 relative"
      >
        <LoadingOverlay visible={fetchingNameEnquiryDetails} overlayBlur={2} />
        <p>Enter recipient details</p>
        <Select
          size="md"
          label="Bank"
          placeholder="Select Bank"
          withAsterisk
          data={banks}
          {...payRecipientForm.getInputProps("bank")}
          disabled={!!recipientDetails?.account_name}
        />
        <Select
          size="md"
          label="Currency"
          withAsterisk
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
          withAsterisk
          label="Account number"
          placeholder="Enter account number"
          {...payRecipientForm.getInputProps("account_number")}
          onChange={(e) => handleAccountNumberChange(e.target.value)}
          disabled={!!recipientDetails?.account_number}
        />

        <TextInput
          size="md"
          withAsterisk
          placeholder="Enter account name"
          label="Account name"
          {...payRecipientForm.getInputProps("account_name")}
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
