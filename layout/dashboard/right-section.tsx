import {
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { ConvertIcon } from "@/components/icons";
import styles from "@/styles/dashboard.module.css";
import { useCurrencyOptions, useGetCurrencies } from "@/api/hooks/currencies";
import { useMemo, useState } from "react";
import { useGetRecipients } from "@/api/hooks/recipients";
import { useBankOptions, useGetBanks } from "@/api/hooks/banks";
import { z } from "zod";
import { PayRecipient } from "../recipients/recipient-list";
import { IRecipient } from "@/utils/validators/interfaces";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { SendMoneyModal } from "../common/send-money-modal";
import { useIsVerified } from "@/api/hooks/user";
import { PayFxRecipient, SendFxMoneyModal } from "../common/send-fx-modal";
export function RightSection() {
  const { isLoading: currenciesLoading, currencyOptions } =
    useCurrencyOptions();
  const { isLoading: recipientsLoading, data: recipients } = useGetRecipients();
  const {
    bankOptions,
    isLoading: loadingBanks,
    getBankName,
  } = useBankOptions();
  const [showModal, setShowModal] = useState(false);
  const { isLoading, defaultGateway } = useDefaultGateway();
  const { isLoading: isVerifyLoading, isVerified } = useIsVerified();
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

  const initialState = {
    amount: 1000,
    account_name: "",
    account_number: "",
    bank_name: "",
    sort_code: "",
    bic: "",
    iban: "",
    recipient_address: "",
    city: "",
    state: "",
    zipcode: "",
    narration: "",
    // bank: ""
    // currency: "",
  };
  const [fxRecipientDetails, setFxRecipientDetails] =
    useState<z.infer<typeof PayFxRecipient>>(initialState);

  const [showFxModal, setShowFxModal] = useState(false);
  const [showSelectRecipientModal, setShowSelectRecipientModal] =
    useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);

  function handleSend(recipient: IRecipient) {
    if (recipient.fx_bank_name) {
      setFxRecipientDetails({
        amount: 1000,
        bank_name: recipient.fx_bank_name,
        ...recipient,
      });
      setShowFxModal(true);
    } else {
      setShowModal(true);
      setRecipientDetails({
        account_name: recipient.account_name,
        bank: recipient.bank ?? "",
        amount: 1000,
        account_number: recipient.account_number ?? "",
        currency: "NGN",
        narration: "",
      });
    }

    setShowRecipientsModal(false);
  }

  function handleNewFxRecipientSend() {
    setShowSelectRecipientModal(false);
    setShowFxModal(true);
  }

  function handleNewRecipientSend() {
    setShowSelectRecipientModal(false);
    setRecipientDetails({
      bank: "",
      currency: "NGN",
      amount: 1000,
      account_name: "",
      account_number: "",
      narration: "",
    });

    setShowModal(true);
  }

  return (
    <div className="w-[350px] flex flex-col gap-6">
      <div className="relative">
        <LoadingOverlay visible={isVerifyLoading} />
        <Button
          className="bg-primary-100"
          size="lg"
          onClick={() => setShowSelectRecipientModal(true)}
          disabled={!isVerified}
          fullWidth
        >
          Send money
        </Button>
      </div>
      <div className="bg-gray-30 border rounded-lg p-4">
        <section className="bg-white p-4 rounded border flex gap-4">
          <Select
            className="flex-grow"
            label="Currency"
            defaultValue="NGN"
            data={currencyOptions}
            nothingFound={"No currencies found"}
          />
          <NumberInput
            className="flex-grow"
            label="You send"
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
          />
        </section>
        <section className="h-24 flex items-center justify-center relative">
          <div className="absolute h-full w-5 bg-white mx-auto"></div>
          <div className="relative h-10 aspect-square rounded-full bg-white flex items-center justify-center">
            <ConvertIcon />
          </div>
        </section>
        <section className="bg-white p-4 rounded border flex gap-4">
          <Select
            className="flex-grow"
            label="Currency"
            defaultValue="GBP"
            data={currencyOptions}
          />
          <NumberInput
            className="flex-grow"
            label="You receive"
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
          />
        </section>

        <div className="text-primary-70 text-center my-5">
          Market Rate: 1 USD = 1.2 GBP
        </div>

        <Button className="bg-accent hover:bg-accent" size="md" fullWidth>
          Exchange
        </Button>
      </div>
      <div className={`${styles.worldBackground}`}>
        <span className="text-white">Link your account</span>
        <span className="text-accent">to Amazon, Paypal and more.</span>

        <a href="" className="mt-auto">
          <button className="px-3 py-2 border-2 border-accent rounded-md text-white">
            Learn more
          </button>
        </a>
      </div>

      <Modal
        title={
          <span className="text-accent text-xl font-semibold">
            Choose Recipient
          </span>
        }
        size="md"
        withCloseButton={false}
        opened={showSelectRecipientModal}
        padding="lg"
        onClose={() => setShowSelectRecipientModal(false)}
        centered
      >
        <Stack>
          <p>Choose from your saved recipients or send to new recipient</p>

          <Button
            className="bg-accent hover:bg-accent font-normal"
            fullWidth
            size="lg"
            onClick={() => {
              setShowSelectRecipientModal(false);
              setShowRecipientsModal(true);
            }}
          >
            Saved Recipient
          </Button>
          <Button
            className="bg-primary-100 hover:bg-primary-100 font-normal"
            fullWidth
            size="lg"
            onClick={handleNewRecipientSend}
          >
            Unsaved Local Recipient
          </Button>
          <Button
            className="bg-primary-100 hover:bg-primary-100 font-normal"
            fullWidth
            size="lg"
            onClick={handleNewFxRecipientSend}
          >
            Unsaved Fx Recipient
          </Button>
        </Stack>
      </Modal>

      <Modal
        title={
          <span className="text-accent text-xl font-semibold">
            Saved Recipients
          </span>
        }
        size="md"
        opened={showRecipientsModal}
        padding="lg"
        onClose={() => setShowRecipientsModal(false)}
        centered
      >
        <Stack>
          {recipientsLoading ? (
            <>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </>
          ) : (
            recipients?.data.map((recipient) => (
              <Stack spacing="sm" key={recipient.id}>
                <Group position="apart">
                  <Stack spacing={0}>
                    <Text>{recipient.account_name}</Text>
                    <Text size="xs" weight={600}>
                      {getBankName(Number(recipient.bank))?.name}
                    </Text>
                  </Stack>

                  <Button
                    variant="white"
                    className="text-accent"
                    onClick={() => {
                      handleSend(recipient);
                    }}
                  >
                    Send
                  </Button>
                </Group>

                <Divider />
              </Stack>
            ))
          )}
        </Stack>
      </Modal>

      {showModal && (
        <SendMoneyModal
          modalOpen={showModal}
          close={() => setShowModal(false)}
          banks={bankOptions}
          currencies={currencyOptions}
          gateway={defaultGateway?.gateway}
          recipientDetails={recipientDetails}
        />
      )}

      {showFxModal && (
        <SendFxMoneyModal
          close={() => {
            setShowFxModal(false);
            setFxRecipientDetails(initialState);
          }}
          modalOpen={showFxModal}
          recipientDetails={fxRecipientDetails}
        />
      )}
    </div>
  );
}
