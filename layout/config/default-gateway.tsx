import { Button, Group, Stack } from "@mantine/core";

export function MakeDefaultGateway({
  closeModal,
  handleProceed,
  gateway,
}: {
  closeModal: () => void;
  handleProceed: () => void;
  gateway: string;
}) {
  return (
    <Stack spacing="sm">
      <h2 className="text-accent font-medium text-2xl font-secondary">
        Change default gateway
      </h2>
      <p className="font-primary">
        Do you want to make {gateway} your default gateway?
      </p>

      <Group grow spacing="xl" className="mt-2">
        <Button
          className="bg-accent hover:bg-accent text-white"
          size="md"
          onClick={handleProceed}
        >
          Yes
        </Button>
        <Button
          className="bg-[#F4F4F4] hover:bg-[#F4F4F4] text-gray-90 border"
          size="md"
          onClick={closeModal}
        >
          No, cancel
        </Button>
      </Group>
    </Stack>
  );
}
