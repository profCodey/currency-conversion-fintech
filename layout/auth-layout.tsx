import { TextInput, PasswordInput, Stack, Button } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

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
      <div className="hidden md:block sm:w-1/3 h-full bg-slate-800"></div>
      <div className="w-full md:w-2/3 border border-r-2 h-full flex justify-center items-center p-4">
        <section className="w-full max-w-[500px] p-4">
          <div className="mb-8">
            <h1 className="font-bold">{title}</h1>
            <p className="mt-2">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
