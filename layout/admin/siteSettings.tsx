import { useLogout } from "@/api/hooks/auth";
import {
  useGetClientDetails,
  useGetCurrentUser,
  useSyncDeposits,
} from "@/api/hooks/user";
import { DashboardItems } from "@/components/dashboard-items";
import { LogoutIcon } from "@/components/icons";
import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Header,
  HoverCard,
  MediaQuery,
  Navbar,
  Skeleton,
  Stack,
  Tooltip,
  clsx,
} from "@mantine/core";
import { Text } from "@mantine/core";
import { modals, closeAllModals } from "@mantine/modals";
import { ReactNode, useState, useEffect } from "react";
import AppLogo from "@/public/logo-light.svg";
import MobileLogo from "@/public/payceler-logo.svg";
import { AdminDashboardItems } from "@/components/admin-dashboard-items";
import { USER_CATEGORIES } from "@/utils/constants";
import Link from "next/link";
import { useGetSelectedGateways } from "@/api/hooks/gateways";
import { InfoCircle, Refresh } from "iconsax-react";
import Cookies from "js-cookie";
import { useGetSiteSettings } from "@/api/hooks/admin/sitesettings";
import { ISiteSettings } from "@/utils/validators/interfaces";
import Image from 'next/image';

// let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

interface AppLayoutProps {
  children: ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  const [opened, setOpened] = useState(false);
  const { isLoading, data } = useGetCurrentUser();
  const { isLoading: clientDetailsLoading } = useGetClientDetails(
    data?.data.id
  );

  const { data: selectedGateways, isLoading: gatewaysLoading } =
    useGetSelectedGateways();
  const { mutate: syncDeposits, isLoading: syncDepositsLoading } =
    useSyncDeposits();
  const logout = useLogout();
  const isApiClient = data?.data.category === USER_CATEGORIES.API_CLIENT;

  const homePageRoute = isApiClient ? "/dashboard" : "/admin";
  const { data: siteSettings, isLoading: siteSettingsLoading } =
  useGetSiteSettings();
  const settings: ISiteSettings | undefined = siteSettings?.data;

  const colorBackground = settings?.background_color;

  const [logo, setLogo] = useState("");
  useEffect(() => {
    setLogo(settings?.logo);
  }, [settings?.logo]);
  
  function handleLogout() {
    modals.openConfirmModal({
      title: <Text className="font-secondary">Please confirm your action</Text>,
      children: <Text size="sm">Are you sure you want to log out?</Text>,
      labels: { confirm: "Yes, logout", cancel: "No, Cancel" },
      confirmProps: { color: "red", className: "bg-red-600 hover:bg-red-500" },
      onCancel: closeAllModals,
      onConfirm: logout,
    });
  }

  const content =
    isLoading || clientDetailsLoading ? (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <Skeleton height={100} />
        <Skeleton height={200} />
        <Skeleton className="flex-grow" />
      </div>
    ) : (
      children
    );

  const defaultGateway = selectedGateways?.data && Array.isArray(selectedGateways.data)
  ? selectedGateways.data.find((gateway) => gateway.is_default)
  : null;


  const dashboardItems =
    data?.data.category === USER_CATEGORIES.API_CLIENT ? (
      <DashboardItems />
    ) : (
      <AdminDashboardItems />
    );

  const dashboardSkeletons = (
    <Stack spacing="xl" className="mt-24">
      <Skeleton height={50} />
      <Skeleton height={50} />
      <Skeleton height={50} />
      <Skeleton height={50} />
      <Skeleton height={50} />
    </Stack>
  );

  return (
    <AppShell
      padding={0}
      className="max-h-screen"
      header={
        <div 
        style={{backgroundColor: colorBackground}}
        className="h-20 flex md:hidden">
          {/* <MediaQuery styles={{ display: "none" }} smallerThan="sm"> */}
          <div className="h-full w-full md:hidden items-center justify-between px-10 flex">
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              color="white"
            />
            <div className="scale-50">
              {/* <MobileLogo /> */}
              <Image src={logo} alt="" width="100" height="100"/>
            </div>
          </div>
          {/* </MediaQuery> */}
        </div>
      }
      aside={
        <Navbar
        p={32}
        style={{backgroundColor: colorBackground}}
        className="border-none order-1 left-0 overflow-y-auto"
        width={{ sm: 200, lg: 300 }}
        hiddenBreakpoint="sm"
        hidden={!opened}
      >
          <section className="py-2 pt-4 h-full flex flex-col">
            <div className="w-full flex justify-between items-center">
              <Stack spacing="xs" className="w-full">
                <Link href={homePageRoute}>
                  {/* <AppLogo /> */}
                  <Image src={logo} alt="" width="100" height="100"/>
                </Link>
                {isApiClient && (
                  <Skeleton visible={gatewaysLoading}>
                    <Group className="w-full">
                      <small className="text-white">
                        {defaultGateway
                          ? defaultGateway.gateway_name
                          : "Default not set"}
                      </small>

                      <ActionIcon
                        ml="auto"
                        className="hover:bg-transparent"
                        onClick={() => syncDeposits()}
                      >
                        <Tooltip
                          label="Synchronise deposits"
                          color="white"
                          classNames={{ tooltip: "text-black" }}
                          position="bottom"
                        >
                          <Refresh
                            variant="Broken"
                            size={16}
                            color="white"
                            className={clsx(
                              syncDepositsLoading && "animate-spin"
                            )}
                          />
                        </Tooltip>
                      </ActionIcon>

                      <HoverCard
                        width={200}
                        classNames={{ dropdown: "text-xs p-2" }}
                      >
                        <HoverCard.Target>
                          <InfoCircle size={16} color="white" />
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          This is the default gateway through which transactions
                          are performed, you can set this up or change it the
                          config section
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Group>
                  </Skeleton>
                )}
              </Stack>

              <MediaQuery styles={{ display: "none" }} largerThan="sm">
                <Burger
                  opened={opened}
                  color="white"
                  onClick={() => setOpened(false)}
                />
              </MediaQuery>
            </div>
            {isLoading ? dashboardSkeletons : dashboardItems}
            <div
              className="flex gap-4 items-center py-2 cursor-pointer mt-auto"
              tabIndex={0}
              onClick={handleLogout}
            >
              <LogoutIcon />
              <span className="text-slate-400 text-lg">Logout</span>
            </div>
          </section>
        </Navbar>
      }
    >
      <section className="order-2 h-full max-h-screen w-full px-5 py-5 overflow-y-auto">
        {content}
      </section>
    </AppShell>
  );
}