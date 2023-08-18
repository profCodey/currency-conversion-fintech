import { useAddGateway, useMakeDefaultGateway } from "@/api/hooks/gateways";
import { IGateway, ISelectedGateway } from "@/utils/validators/interfaces";
import { Button, Loader, Modal, Stack } from "@mantine/core";
import { ReactNode, useState } from "react";
import { AddNewGateway } from "./new-gateway";
import { MakeDefaultGateway } from "./default-gateway";
import { useIsVerified } from "@/api/hooks/user";

export default function GatewaysDisplay({
  selectedGateways,
  unSelectedGateways,
}: {
  selectedGateways: Array<ISelectedGateway>;
  unSelectedGateways: ReactNode;
}) {
  const [modalState, setModalState] = useState<ISelectedGateway | null>(null);
  const { mutate: makeDefaultGateway, isLoading } = useMakeDefaultGateway(() =>
    setModalState(null)
  );

  function handleDefaultGatewaySelect(gateway: ISelectedGateway) {
    setModalState(gateway);
  }

  return (
    <section className="text-gray-90">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[50vh]">
        <section className="flex flex-col gap-2 p-5 border-r  rounded-lg bg-gray-30 border ">
          <div className="flex gap-4">
            <h3 className="text-secondary mb-2">Select Default Gateway</h3>
            {isLoading && <Loader size="xs" color="green" />}
          </div>
          {selectedGateways.map((gateway) => (
            <Gateway
              key={gateway.id}
              gateway={gateway}
              handleSelect={handleDefaultGatewaySelect}
            />
          ))}
        </section>
        <section className="p-5 rounded-lg bg-gray-30 border ">
          {unSelectedGateways}
        </section>
      </section>

      <Modal
        opened={!!modalState}
        centered
        onClose={() => setModalState(null)}
        withCloseButton={false}
        size="md"
        padding="lg"
      >
        <MakeDefaultGateway
          closeModal={() => setModalState(null)}
          gateway={modalState?.gateway_name ?? ""}
          handleProceed={() =>
            makeDefaultGateway({ gateway_id: modalState!.id, is_default: true })
          }
        />
      </Modal>
    </section>
  );
}

function Gateway({
  gateway,
  handleSelect,
}: {
  gateway: ISelectedGateway;
  handleSelect: (arg0: ISelectedGateway) => void;
}) {
  const { isVerified } = useIsVerified();
  return (
    <div
      key={gateway.id}
      className="bg-white flex items-center justify-between px-4 py-2 rounded-[4px] border"
    >
      <span className="text-sm font-semibold">{gateway.gateway_name}</span>

      {gateway.status !== "approved" ? (
        <Button variant="subtle" color="red">
          Not approved
        </Button>
      ) : gateway.is_default ? (
        <Button className="bg-white hover:bg-white border-[#132144] py-2 px-3 text-[#132144] rounded-[4px]">
          Default
        </Button>
      ) : (
        <Button
          className="bg-[#132144] hover:bg-[#132144] py-2 px-3 text-gray-200 rounded-[4px]"
          onClick={() => isVerified && handleSelect(gateway)}
          disabled={!isVerified}
        >
          Make Default
        </Button>
      )}
    </div>
  );
}

export function UnSelectedGateways({ gateways }: { gateways: IGateway[] }) {
  const [modalState, setModalState] = useState<IGateway | null>(null);
  const { mutate: addGateway, isLoading } = useAddGateway(() =>
    setModalState(null)
  );
  const { isVerified } = useIsVerified();
  if (gateways.length < 1) {
    return (
      <section className="border-2 h-full flex items-center justify-center">
        <span className="text-xl font-secondary">
          You have selected all available gateways
        </span>
      </section>
    );
  }

  function handleAddGateway(gateway: IGateway) {
    if (!isVerified) return;
    setModalState(gateway);
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        <h3 className="text-secondary mb-2">Add New Gateway</h3>
        {isLoading && <Loader size="xs" color="green" />}
      </div>

      {gateways.map((gateway) => (
        <div
          key={gateway.id}
          className="bg-white flex items-center justify-between px-4 py-2 rounded-[4px] border"
        >
          <Stack spacing="xs">
            <span className="text-sm font-semibold">{gateway.label}</span>
            <span className="text-sm">{gateway.description}</span>
          </Stack>
          <Button
            className="self-start shrink-0 bg-white hover:bg-white border-[#132144] py-2 px-3 text-[#132144] rounded-[4px]"
            onClick={() => handleAddGateway(gateway)}
            disabled={isLoading || !isVerified}
          >
            Add Gateway
          </Button>
        </div>
      ))}

      <Modal
        opened={!!modalState}
        centered
        onClose={() => setModalState(null)}
        withCloseButton={false}
        size="md"
        padding="lg"
      >
        <AddNewGateway
          closeModal={() => setModalState(null)}
          gateway={modalState?.description ?? ""}
          handleProceed={() =>
            addGateway({ gateway: modalState!.id, is_approved: false })
          }
        />
      </Modal>
    </div>
  );
}
