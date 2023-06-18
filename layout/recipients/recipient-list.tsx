import { useDeleteRecipient, useGetRecipients } from "@/api/hooks/recipients";
import { Button, Loader, Text } from "@mantine/core";
import BankIcon from "@/public/bank-icon.svg";
import NigeriaFlag from "@/public/nigeria-flag.svg";
import { ArrowRight } from "iconsax-react";
import { useState } from "react";
import { IRecipient } from "@/utils/validators/interfaces";
import { z } from "zod";
import { SendMoneyModal } from "../common/send-money-modal";
import { closeAllModals, modals } from "@mantine/modals";
import { useBankOptions } from "@/api/hooks/banks";

export const PayRecipient = z.object({
  bank: z.string().min(1, { message: "Bank name is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  amount: z.number().gte(10),
  account_name: z.string().min(1, { message: "Account name is required" }),
  account_number: z.string().min(1, { message: "Account number is required" }),
  narration: z.string().min(1, { message: "Narration is required" }),
});

export function RecipientList({
  banks,
  currencies,
  gateway,
}: {
  banks: { label: string; value: string }[];
  currencies: { label: string; value: string }[];
  gateway: number | undefined;
}) {
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
  const { getBankName } = useBankOptions();
  const { isLoading: recipientsLoading, data: recipients } = useGetRecipients();
  const { mutate: deleteRecipient, isLoading: deleteRecipientLoading } =
    useDeleteRecipient();

  const [showModal, setShowModal] = useState(false);

  if (recipientsLoading) return <Loader color="green" />;

  function handleSend(recipient: IRecipient) {
    setShowModal(true);
    setRecipientDetails({
      account_name: recipient.account_name,
      bank: recipient.bank,
      amount: 1000,
      account_number: recipient.account_number ?? "",
      currency: "NGN",
      narration: "",
    });
  }

  function handeDeleteRecipient(recipient: IRecipient) {
    modals.openConfirmModal({
      title: "Please confirm the following details",
      children: (
        <Text>
          {`Are you sure you want to delete ${recipient.account_name}'s ${
            getBankName(Number(recipient.bank))?.name
          }  as a
          recipient?`}
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: {
        className: "bg-primary-100",
        loading: deleteRecipientLoading,
      },
      onCancel: closeAllModals,
      onConfirm: () => deleteRecipient(recipient.id),
    });
  }

  return (
    <>
      <section className="grid grid-cols-3 gap-5">
        {recipients?.data.map((recipient) => (
          <div key={recipient.id} className="border rounded font-secondary">
            <div className="p-4 border bg-gray-30 flex items-center gap-4 rounded-t text-gray-90 font-semibold text-sm">
              <BankIcon />
              <span className="mr-auto">
                {getBankName(Number(recipient.bank))?.name ||
                  "Bank name not added"}
              </span>

              <NigeriaFlag />
            </div>
            <div className="p-4 flex flex-col gap-4 text-sm text-gray-90">
              <div>Account Name: {recipient.account_name}</div>
              <div>Account No: {recipient.account_number}</div>

              <div className="flex justify-between mt-5">
                <Button
                  variant="white"
                  className="text-[#BA0000]"
                  onClick={() => handeDeleteRecipient(recipient)}
                >
                  Delete
                </Button>
                <Button
                  className="bg-primary-100 text-white"
                  rightIcon={<ArrowRight />}
                  onClick={() => handleSend(recipient)}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {showModal && (
        <SendMoneyModal
          modalOpen={showModal}
          close={() => setShowModal(false)}
          banks={banks}
          currencies={currencies}
          gateway={gateway}
          recipientDetails={recipientDetails}
        />
      )}
    </>
  );
}
