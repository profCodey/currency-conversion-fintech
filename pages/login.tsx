import AuthLayout from "@/layout/auth-layout";
import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { z } from "zod";

export const loginFormValidator = z.object({
  email: z.string().email("Enter valid email"),
  password: z
    .string()
    .min(5, { message: "Enter password with 5 characters at least" }),
});

export default function Login() {
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginFormValidator),
  });

  function handleSubmit(values: z.infer<typeof loginFormValidator>) {
    // handle login
    console.log({ values });
  }

  return (
    <AuthLayout
      title="Hi, Welcome Back!"
      subtitle="Please enter your details to login."
    >
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
            className="mt-1 bg-[#132144] hover:bg-[#132144]"
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
    </AuthLayout>
  );
}
