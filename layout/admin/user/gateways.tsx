import {
  useApproveGateway,
  useClientSelectedGateways,
} from "@/api/hooks/admin/users";
import { ISelectedGateway } from "@/utils/validators/interfaces";
import { Button, Group, Skeleton, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";

export function ClientGateways() {
  const router = useRouter();
  const { data: selectedGateways, isLoading } = useClientSelectedGateways(
    router.query.id as string
  );

  const { mutate: approveGateway, isLoading: approveGatewayLoading } =
    useApproveGateway();

  function handleApproveGateway(id: number, status: string) {
    approveGateway({
      id,
      status,
    });
  }

  if (isLoading) {
    return (
      <Stack>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Stack>
    );
  }

  return (
    <section className="p-5">
      <h3 className="text-gray-90 font-semibold mb-2">
        List of selected gateways
      </h3>

      <Skeleton visible={approveGatewayLoading}>
        <Stack>
          {selectedGateways?.data && selectedGateways?.data?.length > 0 ? (
            selectedGateways?.data.map((gateway, idx) => (
              <GatewayOption
                key={idx}
                gateway={gateway}
                approveGateway={handleApproveGateway}
              />
            ))
          ) : (
            <Text>Client has not selected any gateway</Text>
          )}
        </Stack>
      </Skeleton>
    </section>
  );
}

function GatewayOption({
  gateway,
  approveGateway,
}: {
  gateway: ISelectedGateway;
  approveGateway: (arg0: number, arg1: string) => void;
}) {
  return (
    <Group key={gateway.id}>
      {/* <Text>{idx + 1}</Text> */}
      <Text>{gateway.gateway_name}</Text>

      <Group className="ml-auto" spacing="sm">
        {gateway.status === "pending" ? (
          <>
            <Button
              className="bg-primary-100"
              onClick={() => approveGateway(gateway.id, "approved")}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              color="red"
              onClick={() => approveGateway(gateway.id, "rejected")}
            >
              Reject
            </Button>
          </>
        ) : (
          <span>{gateway.status}</span>
        )}
      </Group>
    </Group>
  );
}
