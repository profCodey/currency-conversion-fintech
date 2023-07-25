import AuthLayout from "@/layout/auth/auth-layout";
import { TextInput, Stack, Button } from "@mantine/core";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useResetPassword } from "@/api/hooks/forgot-password";

export default function Login() {
  const { mutate: resetPassword, isLoading } = useResetPassword();
  const forgotPasswordForm = useForm({
    initialValues: { email: "" },
    validate: zodResolver(
      z.object({
        email: z.string().email("Enter valid email"),
      })
    ),
  });

  function handleSubmit(values: { email: string }) {
    resetPassword(values);
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Please provide your registered email address to help us reset your account."
    >
      <form
        className="w-full"
        onSubmit={forgotPasswordForm.onSubmit(handleSubmit)}
      >
        <Stack spacing="lg">
          <TextInput
            placeholder="Email address"
            size="lg"
            {...forgotPasswordForm.getInputProps("email")}
          />
          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            loaderPosition="right"
            className="mt-1 bg-[#132144] hover:bg-[#132144]"
          >
            Send reset instructions
          </Button>

          <div>
            Remember password?{" "}
            <Link className="text-blue-700" href="/login">
              Return to login
            </Link>
          </div>
        </Stack>
      </form>
    </AuthLayout>
  );
}
