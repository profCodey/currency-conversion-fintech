import { ReactNode } from "react";
import styles from "./auth-layout.module.css";
import Logo from "@/public/logo-light.svg";
import Link from "next/link";
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
  return (
    <main className="flex h-screen">
      <div
        className={
          "hidden md:flex sm:w-[450px] h-full bg-primary-100 flex-col justify-between py-14 px-10 "
        }
      >
        <Link href="/">
          <Logo />
        </Link>
        <p className="text-white font-secondary">
          Receive money Anywhere around the world at any time.
        </p>
      </div>
      <div className="w-full flex-grow border border-r-2 h-full flex justify-center items-center p-4">
        <section className="w-full max-w-[500px] p-4">
          <div className="mb-8">
            <h1 className="font-bold font-secondary text-primary-100">
              {title}
            </h1>
            <p className="mt-2 font-secondary text-primary-100">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
