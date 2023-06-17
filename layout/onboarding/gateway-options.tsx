import {
  useAddGateway,
  useGetGateways,
  useGetSelectedGateways,
} from "@/api/hooks/gateways";
import { Button, Group, Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import GreenCheck from "@/public/green-check.svg";
import { IGateway, ISelectedGateway } from "@/utils/validators/interfaces";

export function GatewayOptions({
  userSelectedGateways,
  nextTab,
}: {
  userSelectedGateways: ISelectedGateway[] | undefined;
  nextTab(arg0: string): void;
}) {
  const { data, isLoading } = useGetGateways();

  const [selectedGateways, setSelectedGateways] = useState<number[]>([]);

  const { mutate: addGateway, isLoading: addGatewayLoading } = useAddGateway();
  function handleSelect(gatewayId: number) {
    setSelectedGateways([...selectedGateways, gatewayId]);
  }

  function handleDeselect(gatewayId: number) {
    const filteredIds = selectedGateways.filter(
      (gateway) => gateway !== gatewayId
    );
    setSelectedGateways(filteredIds);
  }

  function handleSubmit() {
    if (selectedGateways.length < 1) {
      return showNotification({
        message: "You have not selected any gateways",
        color: "cyan",
      });
    }

    for (const gateway of selectedGateways) {
      addGateway({ gateway, is_approved: false });
    }
  }

  if (isLoading)
    return (
      <div>
        Loading <Loader color="green" />
      </div>
    );

  const alreadySelectedGateways =
    userSelectedGateways?.map((gateway) => gateway.gateway) || [];

  return (
    <section>
      <section className="flex flex-col gap-2">
        {data?.data.map((gateway) => (
          <GatewayOption
            key={gateway.id}
            gateway={gateway}
            selectedGateways={selectedGateways}
            handleSelect={handleSelect}
            handleDeselect={handleDeselect}
            userSelectedGateways={alreadySelectedGateways}
          />
        ))}

        <Group grow className="w-[400px]">
          {data?.data &&
            alreadySelectedGateways?.length < data?.data.length && (
              <Button
                className="bg-accent hover:bg-accent mt-4"
                size="lg"
                onClick={handleSubmit}
                loading={addGatewayLoading}
              >
                Submit
              </Button>
            )}

          {alreadySelectedGateways?.length > 1 && (
            <Button
              className="bg-accent hover:bg-accent mt-4"
              size="lg"
              onClick={()=>nextTab("status")}
            >
              Next
            </Button>
          )}
        </Group>
      </section>
    </section>
  );
}

function GatewayOption({
  gateway,
  selectedGateways,
  handleSelect,
  handleDeselect,
  userSelectedGateways,
}: {
  gateway: IGateway;
  selectedGateways: number[];
  handleSelect(arg0: number): void;
  handleDeselect(arg0: number): void;
  userSelectedGateways: number[];
}) {
  const isSelected = selectedGateways.includes(gateway.id);
  const userSelected = userSelectedGateways.includes(gateway.id);

  return (
    <div
      className="bg-white w-[400px] py-2 flex justify-between items-center px-5 border rounded"
      key={gateway.id}
      tabIndex={1}
    >
      <span className="text-gray-90 text-sm">{gateway.description}</span>

      {userSelected ? (
        <GreenCheck />
      ) : isSelected ? (
        <button
          className="border px-4 py-2 text-white rounded text-sm bg-[#007413]"
          onClick={() => handleDeselect(gateway.id)}
        >
          Deselect
        </button>
      ) : (
        <button
          className="border bg-white px-4 py-2 text-accent rounded text-sm"
          onClick={() => handleSelect(gateway.id)}
        >
          Select
        </button>
      )}
    </div>
  );
}
