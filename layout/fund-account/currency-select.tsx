import { Button, NumberInput, Select, Stack } from "@mantine/core";

export function CurrencySelect({ handleNext }: { handleNext: () => void }) {
  return (
    <Stack spacing="xl" className="w-[350px]">
      <span className="text-gray-90">
        Select Currency and Amount to be funded
      </span>
      <Select placeholder="Select Currency" data={[]} size="md" />
      <NumberInput placeholder="Amount" size="md" />
      <Button className="bg-primary-100 hover:bg-primary-100 mt-2" size="md" onClick={handleNext}>
        Next
      </Button>
    </Stack>
  );
}
