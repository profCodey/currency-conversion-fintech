import AuthLayout from "@/layout/auth-layout";
import {
  TextInput,
  PasswordInput,
  Stack,
  Button,
  Group,
  Text,
  Select,
} from "@mantine/core";
import Link from "next/link";
import { ReactElement, forwardRef } from "react";
import ReactCountryFlag from "react-country-flag";
import { ArrowDown2, Location } from "iconsax-react";
import { allCountries } from "@/utils/countries";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  flag: string;
  label: string;
}

export const signupFormValidator = z
  .object({
    country: z.string().min(1, { message: "Select country" }),
    firstName: z.string().min(1, { message: "Enter first name" }),
    lastName: z.string().min(1, { message: "Enter last name" }),
    email: z.string().email("Enter valid email"),
    password: z.string().min(5, "Enter password with at least 5 characters"),
    confirmPassword: z
      .string()
      .min(5, "Enter password with at least 5 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });

export default function Signup() {
  const signupForm = useForm({
    initialValues: {
      country: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(signupFormValidator),
  });

  // eslint-disable-next-line react/display-name
  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ flag, label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <ReactCountryFlag countryCode={flag} svg />
          <Text size="sm">{label}</Text>
        </Group>
      </div>
    )
  );

  function handleSignup() {}

  return (
    <form className="w-full" onSubmit={signupForm.onSubmit(handleSignup)}>
      <Stack spacing="lg">
        <Select
          searchable
          rightSection={
            <ArrowDown2 size="16" color="#8F9BB2" variant="Outline" />
          }
          icon={<Location size="16" color="#8F9BB2" variant="Bold" />}
          itemComponent={SelectItem}
          data={allCountries}
          size="lg"
          placeholder="Select country"
          {...signupForm.getInputProps("country")}
        />
        <TextInput
          placeholder="First Name"
          size="lg"
          {...signupForm.getInputProps("firstName")}
        />
        <TextInput
          placeholder="Last Name"
          size="lg"
          {...signupForm.getInputProps("lastName")}
        />
        <TextInput
          type="email"
          placeholder="Enter email address"
          size="lg"
          {...signupForm.getInputProps("email")}
        />

        <PasswordInput
          placeholder="Password"
          size="lg"
          {...signupForm.getInputProps("password")}
        />
        <PasswordInput
          placeholder="Confirm Password"
          size="lg"
          {...signupForm.getInputProps("confirmPassword")}
        />

        {/* <small className="text-red-700 text-sm">Forgot Password?</small> */}
        <Button
          type="submit"
          size="lg"
          className="mt-1 bg-[#132144] hover:bg-[#132144]"
        >
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
  );
}

Signup.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout
      title="Sign up"
      subtitle="Please enter your details to get started"
    >
      {page}
    </AuthLayout>
  );
};
