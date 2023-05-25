import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";

export function ChangeNumberForm() {
  return (
    <form className="p-2">
      <Stack>
        <TextInput
          label="Phone number"
          placeholder="Enter new phone number"
          size="md"
        />
        <PasswordInput
          label="Password check"
          placeholder="Please enter your password"
          size="md"
        />
        <Button
          fullWidth
          className="bg-primary-100 hover:bg-primary-100"
          size="md"
        >
          Confirm update
        </Button>
      </Stack>
    </form>
  );
}
