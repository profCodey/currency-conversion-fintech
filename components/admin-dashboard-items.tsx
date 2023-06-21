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

export function AdminDashboardItems() {
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
        href="/admin"
        className={`flex gap-4 items-center group ${getTextColorFromPath(
          "/admin"
        )}`}
      >
        <DashboardIcon color={isCurrentPath("/admin")} />
        <span className="group-hover:text-white peer-hover:text-white">
          Dashboard
        </span>
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

      <Link
        href="/config"
        className={`flex gap-4 items-center ${getTextColorFromPath("/config")}`}
      >
        <SettingsIcon color={isCurrentPath("/config")} />
        <span>Config</span>
      </Link>
    </Stack>
  );
}
