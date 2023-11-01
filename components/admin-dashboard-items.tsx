import {
  DashboardIcon,
  SettingsIcon,
  TransactionsIcon,
} from "@/components/icons";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import UsersIcon from "@/components/icons/user-icon.svg";
import { Stack, createStyles } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavLink } from "@mantine/core";
import { ArrowRight2, DocumentText, I24Support, CopySuccess } from "iconsax-react";

export const useNavStyles = createStyles(() => ({
  navLink: {
    color: "#ddd",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#00B0F0",
    },
    "&[data-active='true']": {
      backgroundColor: "transparent",
      color: "#00B0F0",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#00B0F0",
      },
    },
  },
}));

export function AdminDashboardItems() {
  const router = useRouter();
  const { role, isLoading } = useRole();
  const isAdmin = role === USER_CATEGORIES.ADMIN;
  const [currentUrl, setCurrentUrl] = useState(() => router.pathname);
  const [settingsOpen, setSettingsOpen] = useState(
    router.pathname === "/admin/banks" ||
      router.pathname === "/admin/rates" ||
      router.pathname === "/admin/gateways" ||
      router.pathname === "/admin/accounts" ||
      router.pathname === "/admin/currencies"
  );

  const [usersOpen, setUsersOpen] = useState(
    router.pathname === "/admin/users" || router.pathname === "/admin/admins"
  );

  const [complianceOpen, setComplianceOpen] = useState(
    router.pathname === "/admin/global-limit" || router.pathname === "/admin/user-limit"
  );

  const currentPath = router.pathname;
  const { classes } = useNavStyles();

  useEffect(function () {
    setCurrentUrl(currentPath);
  }, [currentPath]);

  function isCurrentPath(path: string) {
    if (path === "/admin") return currentUrl === path ? "#00B0F0" : "";
    return currentUrl.startsWith(path) ? "#00B0F0" : "";
  }

  function handleCollapse(route: string) {
    switch (route) {
      case "/admin/settings":
        return setSettingsOpen(!settingsOpen);
      case "/admin/users":
        return setUsersOpen(!usersOpen);
        case "/admin/global-limit":
          return setComplianceOpen(!complianceOpen);
      default:
        return;
    }
  }

  const routes = [
    {
      route: "/admin",
      label: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      route: "/admin/transactions",
      label: "Transactions",
      icon: <TransactionsIcon />,
    },
    {
      route: "/admin/users",
      label: "Users",
      icon: <UsersIcon />,
      children: [
        { route: "/admin/users", label: "Api clients" },
        { route: "/admin/admins", label: "Admins" },
      ],
    },
    {
      route: "/admin/settings",
      label: "Settings",
      icon: <SettingsIcon />,
      children: [
        {
          route: "/admin/banks",
          label: "Banks",
        },
        {
          route: "/admin/rates",
          label: "Rates",
        },
        {
          route: "/admin/purposes",
          label: "Purposes of Payment"
        },
        {
          route: "/admin/gateways",
          label: "Gateways",
        },
        {
          route: "/admin/accounts",
          label: "Merchant Accounts",
        },
        {
          route: "/admin/currencies",
          label: "Currencies",
        },
      ],
    },
    {
      route: "/admin/global-limit",
      label: "Compliance",
      icon: <CopySuccess size="32" color="#DDD" variant="Bold"/>,
      children: [
        {
          route: "/admin/global-limit",
          label: "Global Limits",
        },
        {
          route: "/admin/user-limit",
          label: "User Limits",
        },
      ],
    },
    {
      route: "/admin/logs",
      label: "Logs",
      icon: <DocumentText />,
    },
    {
      route: "/admin/support",
      label: "Support",
      icon: <I24Support />,
    },
  ];

  if (isAdmin) {
    // Display "Site Settings" link only if the user is an admin
    routes.push({
      route: "/admin/siteSettings",
      label: "Site Settings",
      icon: <SettingsIcon />,
    });
  }

  return (
    <Stack spacing={4} className="mt-16 mb-auto text-lg text-slate-400 font-secondary">
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
          rightSection={route.children && <ArrowRight2 />}
          opened={route.route === "/admin/global-limit" ? complianceOpen : (route.route === "/admin/users" ? usersOpen : settingsOpen)}

          onClick={() => route.children && handleCollapse(route.route)}
        >
          {route.children?.map((route) => (
            <NavLink
              variant="light"
              active={!!isCurrentPath(route.route)}
              key={route.label}
              href={route.route}
              component={Link}
              label={<span className="text-base font-secondary">{route.label}</span>}
              className={classes.navLink}
            />
          ))}
        </NavLink>
      ))}
    </Stack>
  );
}
