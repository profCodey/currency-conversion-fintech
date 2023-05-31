import AuthLayout from "@/layout/auth/auth-layout";
import { TextInput, Stack, Button } from "@mantine/core";
import Link from "next/link";

export default function Login() {
  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Please provide your registered email address to help us reset your account."
    >
      <form className="w-full">
        <Stack spacing="lg">
          <TextInput placeholder="Email address" size="lg" />
          <Button size="lg" className="mt-1 bg-[#132144] hover:bg-[#132144]">
            Login
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
