import { ReactElement, useState } from "react";
import { Button, Modal } from "@mantine/core";
import { AppLayout } from "@/layout/common/app-layout";
import { AddNewGateway, MakeDefaultGateway } from "@/layout/config";

export default function Settings() {
  const [modalState, setModalState] = useState<
    null | "make-default" | "new-gateway"
  >(null);

  function closeModal() {
    setModalState(null);
  }

  function getModalContent() {
    switch (modalState) {
      case "make-default":
        return <MakeDefaultGateway closeModal={closeModal} />;
      case "new-gateway":
        return <AddNewGateway closeModal={closeModal} />;
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Configurations</h2>
        <span>Request and manage gateway here</span>
      </div>

      {/* <Button className="bg-accent hover:bg-accent w-80" size="lg">
        Request For Multiple Gateways
      </Button> */}

      <section className="max-w-[700px] rounded-lg bg-gray-30 border text-gray-90 p-5">
        <h3 className="text-secondary">Select Default Gateway</h3>
        <span className="text-sm">
          Ensure that you are selecting an active gateway
        </span>

        <section className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
          <div className="bg-white flex items-center justify-between px-4 py-2 rounded-[4px]">
            <span>Gateway 1</span>
            <button
              disabled
              className="bg-[#132144] py-2 px-3 text-white rounded-[4px]"
            >
              Default
            </button>
          </div>

          <div className="bg-white flex items-center justify-between px-4 py-2 rounded-[4px]">
            <span>Gateway 2</span>
            <button
              className="border border-[#F3F3FA] py-2 px-3 rounded-[4px] font-medium text-primary-100"
              onClick={() => setModalState("make-default")}
            >
              Make Default
            </button>
          </div>

          <div className="bg-white flex items-center justify-between px-4 py-2 rounded-[4px]">
            <span>Gateway 3</span>
            <button
              className="border border-[#F3F3FA] py-2 px-3 rounded-[4px] font-medium text-primary-100"
              onClick={() => setModalState("make-default")}
            >
              Make Default
            </button>
          </div>

          <div className="bg-white flex items-center justify-between px-4 py-2 rounded-[4px]">
            <span>Gateway 4</span>
            <button
              className="border border-[#F3F3FA] py-2 px-3 rounded-[4px] font-medium text-primary-100"
              onClick={() => setModalState("new-gateway")}
            >
              Add
            </button>
          </div>
        </section>
      </section>

      <section className="max-w-[700px] rounded-lg bg-gray-30 border text-gray-90 p-5">
        <h3 className="font-semibold">API Key</h3>
        <span className="text-sm leading-3">
          This is your API key. You can use this key to integrate with other
          platforms enabling your application or service to effortlessly
          collaborate with other systems.
        </span>

        <section className="mt-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center w-80 px-4 bg-white rounded-[4px] h-11 border leading-[0] text-xl">
              <span>***************************</span>
            </div>
            <Button className="bg-accent" size="md">
              Reveal key
            </Button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center w-80 px-4 bg-white rounded-[4px] h-11 border leading-[0] text-xl">
              <span>***************************</span>
            </div>
            <Button
              className="bg-white text-primary-100 hover:bg-white"
              size="md"
            >
              Reveal key
            </Button>
          </div>
        </section>
      </section>

      <Modal
        opened={!!modalState}
        centered
        onClose={() => setModalState(null)}
        withCloseButton={false}
        size="sm"
        padding="lg"
      >
        {getModalContent()}
      </Modal>
    </div>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
