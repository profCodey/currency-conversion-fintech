import {
  DashboardIcon,
  FundAccountIcon,
  RecipientsIcon,
  SettingsIcon,
  SupportIcon,
  TransactionsIcon,
  Briefcase,
} from "@/components/icons";
import { NavLink, Stack } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useNavStyles } from "./admin-dashboard-items";

const routes = [
  {
    route: "/onboarding",
    label: "Onboarding",
    icon: <Briefcase />,
  },
  {
    route: "/dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    route: "/recipients",
    label: "Recipient",
    icon: <RecipientsIcon />,
  },
  {
    route: "/transactions",
    label: "Transactions",
    icon: <TransactionsIcon />,
  },
  {
    route: "/config",
    label: "Config",
    icon: <SettingsIcon />,
  },
  {
    route: "/support",
    label: "Support",
    icon: <SupportIcon />,
  },
  {
    route: "/fund-account",
    label: "Account",
    icon: <FundAccountIcon />,
  },
];

export function DashboardItems() {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState(() => router.pathname);
  const currentPath = router.pathname;
  const { classes } = useNavStyles();

  useEffect(
    function () {
      setCurrentUrl(currentPath);
    },
    [currentPath]
  );

  function isCurrentPath(path: string) {
    return currentUrl === path ? "#00B0F0" : "";
  }

  return (
    <Stack
      spacing={4}
      className="mt-24 mb-auto text-lg text-slate-400 font-secondary"
    >
      {routes.map((route) => (
        <NavLink
          key={route.label}
          active={!!isCurrentPath(route.route)}
          variant="light"
          label={<span className="text-base font-secondary">{route.label}</span>}
          icon={route.icon}
          component={Link}
          href={route.route}
          className={classes.navLink}
        />
      ))}
    </Stack>
  );
}
