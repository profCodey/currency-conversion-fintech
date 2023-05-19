import AuthLayout from "@/layout/auth-layout";
import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import Link from "next/link";

export default function Signup() {
  return (
    <AuthLayout
      title="Sign up"
      subtitle="Please enter your details to get started"
    >
      <form className="w-full">
        <Stack spacing="lg">
          <TextInput placeholder="First Name" size="lg" />
          <TextInput placeholder="Last Name" size="lg" />
          <TextInput type="email" placeholder="Enter email address" size="lg" />

          <PasswordInput placeholder="Password" size="lg" />
          <PasswordInput placeholder="Confirm Password" size="lg" />

          {/* <small className="text-red-700 text-sm">Forgot Password?</small> */}
          <Button size="lg" className="mt-1 bg-[#132144] hover:bg-[#132144]">
            Sign Up
          </Button>

          <div>
            Have an account?{" "}
            <Link className="text-blue-700" href="/login">
              Login
            </Link>
          </div>

          <div>
            By Clicking the Sign Up button, you agree to our{" "}
            <Link className="text-blue-700" href="/sign-up">
              Privacy Policy
            </Link>
          </div>
        </Stack>
      </form>
    </AuthLayout>
  );
}
