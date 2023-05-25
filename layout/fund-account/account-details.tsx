import { Button, Stack } from "@mantine/core";

export function AccountDetails({ handleNext }: { handleNext: () => void }) {
  return (
    <Stack spacing="xl">
      <span className="text-gray-90">
        Pay Into The Account Below and Click on Next After Payment to fund your
        wallet
      </span>
      <Stack spacing="xl" className="w-[350px]">
        <div>
          <span className="w-32">Account Name: </span>
          <span className="text-gray-90 font-semibold">
            Payceler Global Company
          </span>
        </div>
        <div>
          <span className="w-32">Account Number: </span>
          <span className="text-gray-90 font-semibold">4661775012</span>
        </div>
        <Button
          className="bg-primary-100 hover:bg-primary-100 mt-2"
          size="md"
          onClick={handleNext}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
