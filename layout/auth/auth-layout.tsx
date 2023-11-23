import { ReactNode, useEffect, useState } from "react";
import styles from "./auth-layout.module.css";
import Logo from "@/public/logo-light.svg";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useGetSiteSettings } from "@/api/hooks/admin/sitesettings";
import { ISiteSettings } from "@/utils/validators/interfaces";
interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  const { data: siteSettings, isLoading: siteSettingsLoading } =
  useGetSiteSettings();
  const settings: ISiteSettings | undefined = siteSettings?.data;

  const [logo, setLogo] = useState("");
  useEffect(() => {
    settings?.logo ?
    setLogo(settings?.logo) : setLogo("")
  }, [settings?.logo]);

const primaryColor = settings?.primary_color;
const secondaryColor = settings?.secondary_color;
const backgroundColor = settings?.background_color;

  return (
    <main className="flex h-screen">
      <div
      style={{backgroundColor: backgroundColor}}
        className={
          "hidden md:flex sm:w-[450px] h-full flex-col justify-between py-14 px-10 "
        }
      >
        <Link href="/">
          {/* <Logo /> */}
          <Image src={logo} alt="" width="100" height="100"/>
        </Link>
        <p className="text-white font-secondary">
          Receive money Anywhere around the world at any time.
        </p>
      </div>
      <div className="w-full flex-grow border border-r-2 h-full flex justify-center items-center p-4">
        <section className="w-full max-w-[500px] p-4">
          <div className="mb-8">
            <h1 
            style={{color: primaryColor}}
            className="font-bold font-secondar">
              {title}
            </h1>
            <p 
                 style={{color: primaryColor}}
            className="mt-2 font-secondary text-primary-100">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
