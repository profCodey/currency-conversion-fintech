import { useLogin } from "@/api/hooks/auth";
import AuthLayout from "@/layout/auth/auth-layout";
import { loginFormValidator } from "@/utils/validators";
import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { z } from "zod";

export default function Login() {
  const router = useRouter();
  const { mutate: login, isLoading } = useLogin(
    handleLoginSuccess,
    handleLoginError
  );
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginFormValidator),
  });

  function handleSubmit(values: z.infer<typeof loginFormValidator>) {
    console.log({ values });
    login(values);
  }

  function handleLoginSuccess(data: AxiosResponse) {
    showNotification({
      title: "Login successful",
      message: "Signing you in",
      color: "green",
    });

    if (data.data.is_approved) router.push("/dashboard");
    else router.push("/onboarding");
  }

  function handleLoginError(error: string) {
    const message = error || "We were unable to log you in";
    showNotification({
      title: "An error occured",
      message,
      color: "red",
    });
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
