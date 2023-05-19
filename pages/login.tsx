import AuthLayout from "@/layout/auth-layout";
import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import Link from "next/link";

export default function Login() {
  return (
    <AuthLayout
      title="Hi, Welcome Back!"
      subtitle="Please enter your details to login."
    >
      <form className="w-full">
        <Stack spacing="lg">
          <TextInput placeholder="Enter email address" size="lg" />
          <PasswordInput placeholder="Password" size="lg" />

          <Link href="/forgot-password">
            <small className="text-red-700 text-sm">Forgot Password?</small>
          </Link>
          <Button size="lg" className="mt-1 bg-[#132144] hover:bg-[#132144]">
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
