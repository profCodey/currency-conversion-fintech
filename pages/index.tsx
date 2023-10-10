import { useLogin } from "@/api/hooks/auth";
import AuthLayout from "@/layout/auth/auth-layout";
import { loginFormValidator } from "@/utils/validators";
import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { ReactElement } from "react";
import { z } from "zod";

export default function Login() {

  const { mutate: login, isLoading } = useLogin();
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginFormValidator),
  });

  function handleSubmit(values: z.infer<typeof loginFormValidator>) {
    login(values);
  }

  return (
    <form className="w-full" onSubmit={loginForm.onSubmit(handleSubmit)}>
      <Stack spacing="lg">
        <TextInput
          placeholder="Enter email address"
          size="lg"
          {...loginForm.getInputProps("email")}
        />
        <PasswordInput
          placeholder="Password"
          size="lg"
          {...loginForm.getInputProps("password")}
        />

        <Link href="/forgot-password">
          <small className="text-red-700 text-sm">Forgot Password?</small>
        </Link>
        <Button
          type="submit"
          size="lg"
          className="mt-1 bg-[#132144] hover:bg-[#132144] font-secondary"
          loading={isLoading}
        >
          Login
        </Button>

        <div>
          Not registered yet?{" "}
          <Link className="text-blue-700" href="/sign-up">
            Sign up
          </Link>
        </div>
      </Stack>
    </form>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout
      title="Hi, Welcome Back!"
      subtitle="Please enter your details to login."
    >
      {page}
    </AuthLayout>
  );
};
