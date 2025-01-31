import AuthLayout from "@/layout/auth/auth-layout";
import {
  TextInput,
  PasswordInput,
  Stack,
  Button,
  Group,
  Text,
  Select,
} from "@mantine/core";
import { z } from "zod";
import Link from "next/link";
import { ReactElement, forwardRef } from "react";
import ReactCountryFlag from "react-country-flag";
import { _allCountries } from "@/utils/countries";
import { useForm, zodResolver } from "@mantine/form";
import { signupFormValidator } from "@/utils/validators";
import { useRegister } from "@/api/hooks/auth";
import { CLIENT_TYPES, CLIENT_TYPES_DATA, USER_CATEGORIES } from "@/utils/constants";
import Cookies from "js-cookie";
interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  flag: string;
  label: string;
  description: string;
}



// eslint-disable-next-line react/display-name
export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ flag, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others} key={label}>
      <Group noWrap>
        <ReactCountryFlag countryCode={flag} svg />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

export default function Signup() {
  const { mutate: register, isLoading } = useRegister();
  const signupForm = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      phone_code: "+234",
      category: USER_CATEGORIES.API_CLIENT,
      client_type:"",
    },
    validate: zodResolver(signupFormValidator),
  });

  function handleSignup(values: z.infer<typeof signupFormValidator>) {
    const { phone_code, ...payload } = values;
    payload.phone_number = phone_code + payload.phone_number;

    // console.log({payload});
    register(payload);
  }

  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

  return (
    <form className="w-full" onSubmit={signupForm.onSubmit(handleSignup)}>
      <Stack spacing="lg">
        <div className="flex gap-2">
          <Select
            placeholder=""
            searchable
            data={_allCountries}
            itemComponent={SelectItem}
            filter={(value, item) =>
              item.label!.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.description
                .toLowerCase()
                .includes(value.toLowerCase().trim())
            }
            size="lg"
            classNames={{
              input: "w-[140px]",
            }}
            {...signupForm.getInputProps("phone_code")}
          />
          <TextInput
            placeholder="Phone number"
            size="lg"
            className="flex-grow"
            {...signupForm.getInputProps("phone_number")}
          />
        </div>
        <TextInput
          placeholder="First Name"
          size="lg"
          {...signupForm.getInputProps("first_name")}
        />
        <TextInput
          placeholder="Last Name"
          size="lg"
          {...signupForm.getInputProps("last_name")}
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
          {...signupForm.getInputProps("confirm_password")}
        />

        <Select data={CLIENT_TYPES_DATA}    size="lg"      placeholder="Client Type"         {...signupForm.getInputProps("client_type")}/>
        <Button
          type="submit"
          size="lg"
          variant= "filled"  
          style={{backgroundColor: colorBackground }}   
          className="mt-1 hover:bg-[#132144] font-secondary"
          loading={isLoading}
        >
          Sign Up
        </Button>

        <div>
          Have an account?{" "}
          <Link 
          style={{color: colorSecondary }}  
          href="/login">
            Login
          </Link>
        </div>

        <div>
          By Clicking the Sign Up button, you agree to our{" "}
          <Link 
          style={{color: colorSecondary }}  
          href="/privacy-policy">
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
