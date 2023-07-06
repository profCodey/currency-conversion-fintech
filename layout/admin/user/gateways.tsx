import { useClientSelectedGateways } from "@/api/hooks/admin/users";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";

export function ClientGateways() {
  const router = useRouter();
  const { data: selectedGateways, isLoading } = useClientSelectedGateways(
    router.query.id as string
  );

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

      <Stack>
        {selectedGateways?.data && selectedGateways?.data?.length > 0 ? (
          selectedGateways?.data.map((gateway, idx) => (
            <Group key={gateway.id}>
              <Text>{idx + 1}</Text>
              <Text>{gateway.gateway_name}</Text>
            </Group>
          ))
        ) : (
          <Text>Client has not selected any gateway</Text>
        )}
      </Stack>
    </section>
  );
}
