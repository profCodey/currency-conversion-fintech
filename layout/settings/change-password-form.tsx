import { Button, PasswordInput, Stack } from "@mantine/core";

export function ChangePasswordForm() {
  return (
    <form className="p-2">
      <Stack>
        <PasswordInput
          label="Current password"
          placeholder="Please enter your password"
          size="md"
        />{" "}
        <PasswordInput
          label="New password"
          placeholder="Enter new password"
          size="md"
        />
        <PasswordInput
          label="Confirm new password"
          placeholder="Re-enter new password"
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
