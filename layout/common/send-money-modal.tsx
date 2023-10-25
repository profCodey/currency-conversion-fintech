import { useLocalBalance } from "@/api/hooks/balance";
import { useCreatePayout, useNameEnquiry } from "@/api/hooks/banks";
import { queryClient } from "@/pages/_app";
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
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { ArrowRight, Danger, DirectboxSend, Warning2 } from "iconsax-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const PayRecipient = z.object({
 bank: z.string().min(1, { message: "Bank name is required" }).optional(),
 currency: z.string().min(1, { message: "Currency is required" }),
 amount: z.number().gte(1),
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

export type TransferOperationStage =
 | "send-money"
 | "confirm-details"
 | "transaction-success"
 | "transaction-failed";

export function SendMoneyModal({
 modalOpen,
 close,
 gateway,
 banks,
 currencies,
 recipientDetails,
}: SendMoneyProps) {
 const [form, setForm] = useState<TransferOperationStage>("send-money");
 const [confirmationDetails, setConfirmationDetails] = useState<any>({});
 const [nameEnquiryDetails, setNameEnquiryDetails] = useState<{
  account_number: string;
  bank_code: string;
  gateway_id: string;
 } | null>(null);
 const { mutate: createPayout, isLoading: createPayoutLoading } =
  useCreatePayout(setForm);
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
     title: "Recipient Details",
     component: SendMoneyForm,
    };
   case "confirm-details":
    return {
     title: "Confirm the followind details",
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

 const {
  data: nameEnquiryResult,
  refetch,
  isFetching: fetchingNameEnquiryDetails,
 } = useNameEnquiry(nameEnquiryDetails);

 const payRecipientForm = useForm({
  initialValues: {
   bank: recipientDetails?.bank ? recipientDetails?.bank.toString() : "",
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
  if (values.amount > defaultGatewayBalance) {
   return showNotification({
    title: "Unable to perform transaction",
    message: `Insufficient balance`,
    color: "red",
   });
  }
  setConfirmationDetails(values);
  setForm("confirm-details");
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

 const ConfirmationForm = (
  <Stack align="center" className="w-full">
   <Warning2 size={60} />
   <Text>Amount: ₦{currencyFormatter(confirmationDetails.amount)}</Text>
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
     loading={createPayoutLoading}
     onClick={() =>
      createPayout({
       amount: confirmationDetails.amount,
       narration: confirmationDetails.narration,
       account_number: confirmationDetails.account_number,
       bank: confirmationDetails.bank,
       gateway: gateway as number,
      })
     }
     size="md">
     Yes, Proceed
    </Button>
   </Group>
  </Stack>
 );

 const SendMoneyForm = (
  <form
   onSubmit={payRecipientForm.onSubmit(handleSubmit)}
   className="flex flex-col gap-4 relative">
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
    label={
     <div className="w-full flex justify-between font-normal">
      <span>Enter amount</span>{" "}
      <span className="text-sm text-red-600">
       Balance: ₦{defaultGatewayBalance}
      </span>
     </div>
    }
    labelProps={{
     className: "w-full",
    }}
    placeholder="Enter amount"
    hideControls={false}
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
   Kindly check the transactions page for the status of your transaction
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
   We were unable to proceed with this transaction, check your log for details
  </Text>
 </Stack>
);
