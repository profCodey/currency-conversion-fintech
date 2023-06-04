import {
  Briefcase,
  ConverterIcon,
  DashboardIcon,
  FundAccountIcon,
  RecipientsIcon,
  SettingsIcon,
  SupportIcon,
  TransactionsIcon,
} from "@/components/icons";
import { Stack } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function DashboardItems() {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState(() => router.pathname);
  const currentPath = router.pathname;

  useEffect(
    function () {
      setCurrentUrl(currentPath);
    },
    [currentPath]
  );

  function isCurrentPath(path: string) {
    return currentUrl === path ? "#00B0F0" : "";
  }

  function getTextColorFromPath(path: string) {
    return isCurrentPath(path) ? "text-[#00B0F0]" : "text-slate-400";
  }

  return (
    <Stack spacing="xl" className="mt-24 mb-auto text-lg text-slate-400 ">
      <Link
        href="/onboarding"
        className={`flex gap-4 items-center group ${getTextColorFromPath(
          "/onboarding"
        )}`}
      >
        <Briefcase color={isCurrentPath("/onboarding")} />
        <span className="group-hover:text-white peer-hover:text-white">
          Onboarding
        </span>
      </Link>

      <Link
        href="/dashboard"
        className={`flex gap-4 items-center group ${getTextColorFromPath(
          "/dashboard"
        )}`}
      >
        <DashboardIcon color={isCurrentPath("/dashboard")} />
        <span className="group-hover:text-white peer-hover:text-white">
          Dashboard
        </span>
      </Link>
      <Link
        href="/converter"
        className={`flex gap-4 items-center ${getTextColorFromPath(
          "/converter"
        )}`}
      >
        <ConverterIcon color={isCurrentPath("/converter")} />
        <span>Converter</span>
      </Link>
      <Link
        href="/recipients"
        className={`flex gap-4 items-center ${getTextColorFromPath(
          "/recipients"
        )}`}
      >
        <RecipientsIcon color={isCurrentPath("/recipients")} />
        <span>Recipients</span>
      </Link>
      <Link
        href="/transactions"
        className={`flex gap-4 items-center ${getTextColorFromPath(
          "/transactions"
        )}`}
      >
        <TransactionsIcon color={isCurrentPath("/transactions")} />
        <span>Transactions</span>
      </Link>

      {/* ADMIN FEATURE */}
      <Link
        href="/config"
        className={`flex gap-4 items-center ${getTextColorFromPath("/config")}`}
      >
        <SettingsIcon color={isCurrentPath("/config")} />
        <span>Config</span>
      </Link>
      {/* <Link
        href="/settings"
        className={`flex gap-4 items-center ${getTextColorFromPath(
          "/settings"
        )}`}
      >
        <SettingsIcon color={isCurrentPath("/settings")} />
        <span>Settings</span>
      </Link> */}
      <Link
        href="/support"
        className={`flex gap-4 items-center ${getTextColorFromPath(
          "/support"
        )}`}
      >
        <SupportIcon color={isCurrentPath("/support")} />
        <span>Support</span>
      </Link>
      <Link
        href="/fund-account"
        className={`flex gap-4 items-center ${getTextColorFromPath(
          "/fund-account"
        )}`}
      >
        <FundAccountIcon color={isCurrentPath("/fund-account")} />
        <span>Fund Account</span>
      </Link>
    </Stack>
  );
}
