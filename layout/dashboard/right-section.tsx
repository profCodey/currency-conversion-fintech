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
import styles from "@/styles/dashboard.module.css";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { useState } from "react";
import { useGetRecipients } from "@/api/hooks/recipients";
import { useBankOptions } from "@/api/hooks/banks";
import { z } from "zod";
import { PayRecipient } from "../recipients/recipient-list";
import { IRecipient } from "@/utils/validators/interfaces";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { SendMoneyModal } from "../common/send-money-modal";
import { useIsVerified } from "@/api/hooks/user";
import { PayFxRecipient, SendFxMoneyModal } from "../common/send-fx-modal";
import { ExchangeBox } from "./exchange-box";
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
    <div className="w-full md:w-[350px] flex flex-col gap-6">
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
      <ExchangeBox />
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
