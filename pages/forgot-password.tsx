import { useEffect, useState } from "react";
import AuthLayout from "@/layout/auth/auth-layout";
import { TextInput, Stack, Button, PasswordInput } from "@mantine/core";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  useSetNewPassword,
  useResetPassword,
} from "@/api/hooks/forgot-password";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export const forgotPasswordValidator = z
  .object({
    code: z.string().min(1, "Enter the code sent to your email"),
    email: z.string().email("Enter valid email"),
    new_password: z
      .string()
      .min(5, "Enter password with at least 5 characters"),
    confirm_new_password: z
      .string()
      .min(5, "Enter password with at least 5 characters"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

export default function Login() {
  const router = useRouter();
  const [instructionsSent, setInstructionsSent] = useState(
    () => !!router.query.email || false
  );
  const { mutate: resetPassword, isLoading } =
    useResetPassword(addQueryParameter);
  const { mutate: setNewPassword, isLoading: setNewPasswordLoading } =
    useSetNewPassword(() => router.push("/login"));

  const resetPasswordForm = useForm({
    initialValues: {
      code: "",
      email: router.query.email as string,
      new_password: "",
      confirm_new_password: "",
    },
    validate: zodResolver(forgotPasswordValidator),
  });

  const forgotPasswordForm = useForm({
    initialValues: { email: "" },
    validate: zodResolver(
      z.object({
        email: z.string().email("Enter valid email"),
      })
    ),
  });

  useEffect(
    function () {
      if (router.query.email) {
        setInstructionsSent(true);
        resetPasswordForm.setFieldValue("email", router.query.email as string);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query]
  );

  function handleSubmit(values: { email: string }) {
    resetPassword(values);
  }

  function handleReset(values: z.infer<typeof forgotPasswordValidator>) {
    setNewPassword(values);
  }

  function addQueryParameter() {
    router.query.email = forgotPasswordForm.values.email;
    router.push(router);
    setInstructionsSent(true);
  }

  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Please provide your registered email address to help us reset your account."
    >
      {instructionsSent ? (
        <form
          className="w-full"
          onSubmit={resetPasswordForm.onSubmit(handleReset)}
        >
          <Stack spacing="lg">
            <TextInput
              placeholder="Enter OTP"
              size="lg"
              autoComplete="xxxxx"
              {...resetPasswordForm.getInputProps("code")}
            />
            <PasswordInput
              placeholder="New password"
              size="lg"
              autoComplete="xxxxx"
              {...resetPasswordForm.getInputProps("new_password")}
            />
            <PasswordInput
              placeholder="Confirm password"
              size="lg"
              autoComplete="xxxxx"
              {...resetPasswordForm.getInputProps("confirm_new_password")}
            />

            <Button
              type="submit"
              size="lg"
              loading={setNewPasswordLoading}
              loaderPosition="right"
              className="mt-1 bg-[#132144] hover:bg-[#132144]"
            >
              Reset my Password
            </Button>

            <div>
              {`Didn't receive any email?`}{" "}
              <Button
                variant="white"
                onClick={() =>
                  resetPassword({ email: router.query.email as string })
                }
                loading={isLoading}
                className="text-blue-700"
              >
                Resend reset instructions
              </Button>
            </div>
          </Stack>
        </form>
      ) : (
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
              style={{backgroundColor: colorBackground }}  
              className="mt-1 hover:bg-[#132144]"
            >
              Send reset instructions
            </Button>

            <div>
              Remember password?{" "}
              <Link 
                 style={{color: colorSecondary }}  
              href="/login">
                Return to login
              </Link>
            </div>
          </Stack>
        </form>
      )}
    </AuthLayout>
  );
}
