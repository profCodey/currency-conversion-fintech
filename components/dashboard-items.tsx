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
import { ArrowRight2, Cards } from "iconsax-react";
import { useGetSiteSettings } from "@/api/hooks/admin/sitesettings";
import { ISiteSettings } from "@/utils/validators/interfaces";

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
    route: "/fx-payouts",
    label: "FX",
    icon: <Cards variant="Bold"/>,
    children: [
      {
        route: "/fx-payouts",
        label: "Payout Transactions",
      },
      {
        route: "/fx-exchange",
        label: "Exchange",
      },
    ],
  },
  {
    route: "/local-transactions",
    label: "Payout",
    icon: <TransactionsIcon />,
    children: [
      {
        route: "/local-transactions",
        label: "Transactions",
      },
      {
        route: "/local-statement",
        label: "Account Statement",
      },
      {
        route: "/local-manual-funding",
        label: "Manual Funding",
      },
    ],
  },
  {
    route: "/collection",
    label: "Collection",
    icon: <TransactionsIcon />
  },
  {
    route: "/recipients",
    label: "Recipient",
    icon: <RecipientsIcon />,
  },
  // {
  //   route: "/transactions",
  //   label: "Transactions",
  //   icon: <TransactionsIcon />,
  // },
  {
    route: "/config",
    label: "Config",
    icon: <SettingsIcon />,
  },
  {
    route: "/fund-account",
    label: "Manual Funding",
    icon: <FundAccountIcon />,
  },
  {
    route: "/support",
    label: "Support",
    icon: <SupportIcon />,
  },
];

export function DashboardItems() {
  const { data: siteSettings, isLoading: siteSettingsLoading } =
  useGetSiteSettings();

const settings: ISiteSettings | undefined = siteSettings?.data;
const [isFX, setIsFX] = useState(false);
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState(() => router.pathname);
  const [payoutOpen, setPayoutOpen] = useState(
    router.pathname === "/local-transactions" ||
      router.pathname === "/local-account-statement" ||
      router.pathname === "/local-manual-funding" 
      );

  const [FXOpen, setFXOpen] = useState(
    router.pathname === "/fx-exchange" || router.pathname === "/fx-payouts"
  );
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


  function handleCollapse(route: string) {
    switch (route) {
      case "/fx-payouts":
        return setPayoutOpen(!payoutOpen);
      case "/local-transactions":
        return setFXOpen(!FXOpen);
      default:
        return;
    }
  }

  useEffect(() => {
    if (siteSettings && siteSettings.data) {
      setIsFX(siteSettings.data.use_fx_wallet);
    }
  }, [siteSettings]);
  if (siteSettingsLoading) {
    // Return loading state or placeholder while waiting for the API response
    return <div>Loading...</div>;
  }

  const filteredRoutes = isFX
  ? routes
  : routes.filter((route) => route.route !== "/config" && route.route !== "/collection" && route.route !== "/fx-payouts");

  return (
    <Stack
      spacing={4}
      className="mt-24 mb-auto text-lg text-slate-400 font-secondary"
    >
      {filteredRoutes.map((route) => (
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
          opened={route.route === "/fx-payouts" ? payoutOpen : FXOpen}
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
