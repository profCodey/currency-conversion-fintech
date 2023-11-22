'use client'
import { useGetSiteSettings } from "@/api/hooks/admin/sitesettings";
import { ISiteSettings } from "@/utils/validators/interfaces";
import { useLogin } from "@/api/hooks/auth";
import { useState } from "react";
import AuthLayout from "@/layout/auth/auth-layout";
import { loginFormValidator } from "@/utils/validators";
import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { ReactElement } from "react";
import { z } from "zod";
import Cookies from "js-cookie";
import CookieConsentBanner from "@/components/react-cookie-consent";

export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

        setIsLoggedIn(true);
    }

    const { data: siteSettings, isLoading: siteSettingsLoading } =
    useGetSiteSettings();
    const settings: ISiteSettings | undefined = siteSettings?.data;
    console.log("settings", settings);

const primaryColor = settings?.primary_color;
const secondaryColor = settings?.secondary_color;
const backgroundColor = settings?.background_color;

    //ts-ignore 
    Cookies.set("primary_color", primaryColor);
    Cookies.set("secondary_color", secondaryColor);
    Cookies.set("background_color", backgroundColor);
    
    return (
        <div>
            <form
                className="w-full"
                onSubmit={loginForm.onSubmit(handleSubmit)}>
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
                        <small className="text-red-700 text-sm">
                            Forgot Password?
                        </small>
                    </Link>
                    <Button
                        type="submit"
                        size="lg"
                        style={{backgroundColor: backgroundColor }}   
                        className="mt-1 hover:bg-[#132144] font-secondary"
                        loading={isLoading}>
                        Login
                    </Button>

                    <div>
                        Not registered yet?{" "}
                        <Link 
                        style={{color: secondaryColor}}
                        href="/sign-up">
                            Sign up
                        </Link>
                    </div>
                </Stack>
            </form>
            {/* {isLoggedIn && <CookieConsentBanner />} */}
        </div>
    );
}

Login.getLayout = function getLayout(page: ReactElement) {
    return (
        <AuthLayout
            title="Hi, Welcome Back!"
            subtitle="Please enter your details to login.">
            {page}
        </AuthLayout>
    );
};
