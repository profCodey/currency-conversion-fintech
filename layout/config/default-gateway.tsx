import { Button, Group, Stack } from "@mantine/core";

export function MakeDefaultGateway({ closeModal }: { closeModal: () => void }) {
    return (
      <Stack spacing="sm">
        <h2 className="text-accent font-medium text-2xl font-primary">
          Make Default Gateway
        </h2>
        <p>Do you want to make Gateway 1 your default gateway.</p>
  
        <Group grow spacing="xl" className="mt-2">
          <Button className="bg-accent hover:bg-accent text-white" size="md">
            Yes
          </Button>
          <Button
            className="bg-[#F4F4F4] hover:bg-[#F4F4F4] text-gray-90"
            size="md"
            onClick={closeModal}
          >
            No, cancel
          </Button>
        </Group>
      </Stack>
    );
  }