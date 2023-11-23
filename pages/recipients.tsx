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
import { queryClient } from "./_app";
import Cookies from "js-cookie";

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
      fx_bank_name: "",
      account_name: "",
      user: currentUser?.data.id as number,
      sort_code: "",
      category: "local",
      bic: "",
      iban: "",
      recipient_address: "",
      city: "",
      state: "",
      zipcode: "",
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
          addRecipientForm.setFieldValue("account_name", "");
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
    if (addRecipientForm.values.currency !== "NGN") return;
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
    const { currency, ...rest } = values;
    const payload = {
      ...rest,
      category: currency === "NGN" ? "local" : "fx",
    };

    addRecipient(payload);
  }

  if (currenciesLoading || defaultGatewayLoading || loadingGatewayBanks)
    return <Loader color="green" />;

  const showEuroFields = addRecipientForm.values.currency === "EUR";
  const showUsdFields = addRecipientForm.values.currency === "USD";
  const showGbpFields = addRecipientForm.values.currency === "GBP";
  const showNairaFields = addRecipientForm.values.currency === "NGN";
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  return (
    <section className="flex flex-col gap-8">
      <div style={{ color: colorPrimary}}>
        <h2 className={"text-2xl font-secondary mt-2"}>Recipients</h2>
        <span>Select and Send Money to Saved Recipients</span>
      </div>

      <Button
        leftIcon={<UserPlus style={{ color: colorSecondary }} />}
        className=" text-white w-fit"
        style={{ backgroundColor: colorBackground }}
        size="md"
        onClick={handleAddRecipient}
      >
        Add Recipient
      </Button>

      <Modal
        title="New Recipient"
        withCloseButton={false}
        opened={modalOpen}
        onClose={() => {
          queryClient.removeQueries(["name-enquiry"]);
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
            onChange={(value) => {
              addRecipientForm.reset();
              addRecipientForm.setFieldValue("currency", value || "");
            }}
          />

          {/* For naira, select bank name from list */}
          {showNairaFields && (
            <Select
              aria-label="Banks"
              placeholder="Select Bank"
              searchable
              size="md"
              data={bankOptions}
              {...addRecipientForm.getInputProps("bank")}
            />
          )}

          {/* For currency that isn't naira, you'd have to collect the bank name */}
          {!showNairaFields && (
            <TextInput
              placeholder="Bank name"
              size="md"
              {...addRecipientForm.getInputProps("fx_bank_name")}
            />
          )}

          {!showEuroFields && (
            <TextInput
              placeholder="Account number"
              size="md"
              {...addRecipientForm.getInputProps("account_number")}
              onChange={(e) => handleAccountNumberChange(e.target.value)}
            />
          )}

          <TextInput
            aria-label="Account name"
            placeholder="Account name"
            size="md"
            disabled={addRecipientForm.values.currency === "NGN"}
            {...addRecipientForm.getInputProps("account_name")}
          />

          {showEuroFields && (
            <TextInput
              aria-label="iban"
              placeholder="IBAN"
              size="md"
              {...addRecipientForm.getInputProps("iban")}
            />
          )}

          {showGbpFields && (
            <TextInput
              aria-label="sort code"
              placeholder="Sort code"
              size="md"
              {...addRecipientForm.getInputProps("sort_code")}
            />
          )}

          {(showUsdFields || showEuroFields) && (
            <>
              <TextInput
                aria-label="bic"
                placeholder="BIC"
                size="md"
                {...addRecipientForm.getInputProps("bic")}
              />

              <TextInput
                aria-label="recipient_address"
                placeholder="Recipient Address"
                size="md"
                {...addRecipientForm.getInputProps("recipient_address")}
              />

              <TextInput
                aria-label="city"
                placeholder="City"
                size="md"
                {...addRecipientForm.getInputProps("city")}
              />

              <TextInput
                aria-label="state"
                placeholder="State"
                size="md"
                {...addRecipientForm.getInputProps("state")}
              />

              <TextInput
                aria-label="zip-code"
                placeholder="Zip code"
                size="md"
                {...addRecipientForm.getInputProps("zipcode")}
              />
            </>
          )}

          <Button
            style={{ backgroundColor: colorBackground }}
            type="submit"
            size="md"
            style={{ backgroundColor: colorBackground }}
            className=" transition-colors duration-500"
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
