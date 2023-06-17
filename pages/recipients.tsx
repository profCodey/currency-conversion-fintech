import { useAddRecipient } from "@/api/hooks/recipients";
import { AppLayout } from "@/layout/common/app-layout";
import {
  Button,
  Loader,
  LoadingOverlay,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";
import UserPlus from "@/public/user-plus.svg";
import { useGetCurrencies } from "@/api/hooks/currencies";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { useBankOptions, useNameEnquiry } from "@/api/hooks/banks";
import { showNotification } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { addRecipientFormValidator } from "@/utils/validators";
import { useGetCurrentUser } from "@/api/hooks/user";
import { RecipientList } from "@/layout/recipients/recipient-list";

export default function Recipients() {
  const [modalOpen, setModalOpen] = useState(false);
  const [nameEnquiryDetails, setNameEnquiryDetails] = useState<{
    account_number: string;
    bank_code: string;
    gateway_id: string;
  } | null>(null);
  const { data: currentUser } = useGetCurrentUser();
  const { isLoading: currenciesLoading, data: currencies } = useGetCurrencies();
  const { defaultGateway, isLoading: defaultGatewayLoading } =
    useDefaultGateway();
  const { bankOptions, isLoading: loadingGatewayBanks } = useBankOptions();
  const {
    data: nameEnquiryResult,
    refetch,
    isFetching: fetchingNameEnquiryDetails,
  } = useNameEnquiry(nameEnquiryDetails);

  const { mutate: addRecipient, isLoading: addRecipientLoading } =
    useAddRecipient(() => setModalOpen(false));

  const currencyOptions =
    currencies?.data.map((currency) => ({
      label: currency.name,
      value: currency.code,
    })) ?? [];

  const addRecipientForm = useForm({
    initialValues: {
      currency: "NGN",
      bank: "",
      account_number: "",
      account_name: "",
      user: currentUser?.data.id,
    },
    validate: zodResolver(addRecipientFormValidator),
  });

  useEffect(
    function () {
      if (nameEnquiryResult?.data) {
        const name = nameEnquiryResult?.data.result ?? "";
        if (name) {
          addRecipientForm.setFieldValue("account_name", name);
        } else {
          addRecipientForm.setFieldError("account_name", "Name enquiry failed");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nameEnquiryResult?.data]
  );

  function handleAddRecipient() {
    if (!defaultGateway) {
      return showNotification({
        message: "Please select a default gateway from the config section",
      });
    }
    setModalOpen(true);
  }

  function handleAccountNumberChange(number: string) {
    addRecipientForm.setFieldValue("account_number", number);
    if (number.toString().length === 10) {
      setNameEnquiryDetails({
        account_number: number,
        bank_code: addRecipientForm.values.bank,
        gateway_id: String(defaultGateway?.gateway) ?? "",
      });

      refetch();
    }
  }

  function handleSubmit(values: z.infer<typeof addRecipientFormValidator>) {
    const payload = {
      account_number: values.account_number,
      account_name: values.account_name,
      bank: values.bank,
      user: values.user,
      category: "local",
    };

    addRecipient(payload);
  }

  if (currenciesLoading || defaultGatewayLoading || loadingGatewayBanks)
    return <Loader color="green" />;

  return (
    <section className="flex flex-col gap-8">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Recipients</h2>
        <span>Select and Send Money to Saved Recipients</span>
      </div>

      <Button
        leftIcon={<UserPlus />}
        className="bg-primary-100 hover:bg-primary-100 text-white w-fit"
        size="lg"
        onClick={handleAddRecipient}
      >
        Add Recipient
      </Button>

      <Modal
        title="New Recipient"
        withCloseButton={false}
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          addRecipientForm.reset();
        }}
      >
        <form
          className="flex flex-col gap-4 relative"
          onSubmit={addRecipientForm.onSubmit(handleSubmit)}
        >
          <LoadingOverlay
            visible={fetchingNameEnquiryDetails}
            overlayBlur={2}
          />
          <Select
            aria-label="Currency"
            defaultValue="NGN"
            data={currencyOptions}
            size="md"
            {...addRecipientForm.getInputProps("currency")}
          />
          <Select
            aria-label="Banks"
            placeholder="Select Bank"
            searchable
            data={bankOptions}
            {...addRecipientForm.getInputProps("bank")}
          />
          <TextInput
            placeholder="Account number"
            size="md"
            {...addRecipientForm.getInputProps("account_number")}
            onChange={(e) => handleAccountNumberChange(e.target.value)}
          />
          <TextInput
            aria-label="Account name"
            placeholder="Account name"
            size="md"
            disabled
            {...addRecipientForm.getInputProps("account_name")}
          />
          <Button
            type="submit"
            size="md"
            className="bg-[#132144] hover:bg-[#00B0F0] transition-colors duration-500"
            loading={addRecipientLoading}
          >
            Add Recipient
          </Button>
        </form>
      </Modal>

      <RecipientList
        banks={bankOptions}
        currencies={currencyOptions}
        gateway={defaultGateway?.gateway}
      />
    </section>
  );
}

Recipients.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
