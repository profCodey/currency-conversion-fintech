import { useGetRecipients } from "@/api/hooks/recipients";
import { AppLayout } from "@/layout/common/app-layout";
import { Button, Modal, NumberInput, Select, TextInput } from "@mantine/core";
import { ReactElement, useState } from "react";
import UserPlus from "@/public/user-plus.svg";
import { useGetCurrencies } from "@/api/hooks/currencies";

export default function Recipients() {
  const [modalOpen, setModalOpen] = useState(false);
  const {} = useGetRecipients();
  const {} = useGetCurrencies();
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
        onClick={() => setModalOpen(true)}
      >
        Add Recipient
      </Button>

      <Modal
        title="New Recipient"
        withCloseButton={false}
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form className="flex flex-col gap-4">
          <Select aria-label="Currency" data={[]} size="md" />
          <TextInput aria-label="Bank name" placeholder="Bank name" size="md" />
          <TextInput
            aria-label="Account name"
            placeholder="Account name"
            size="md"
          />
          <TextInput aria-label="Sort code" placeholder="Sort code" size="md" />
          <NumberInput placeholder="Account number" hideControls size="md" />
          <Button
            size="md"
            className="bg-[#132144] hover:bg-[#00B0F0] transition-colors duration-500"
          >
            Add Recipient
          </Button>
        </form>
      </Modal>
    </section>
  );
}

Recipients.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
