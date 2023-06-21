import { useLogout } from "@/api/hooks/auth";
import { useGetClientDetails, useGetCurrentUser } from "@/api/hooks/user";
import { DashboardItems } from "@/components/dashboard-items";
import { LogoutIcon } from "@/components/icons";
import { AppShell, Navbar, Skeleton, Stack } from "@mantine/core";
import { Text } from "@mantine/core";
import { modals, closeAllModals } from "@mantine/modals";
import { ReactNode } from "react";
import AppLogo from "@/public/logo-light.svg";
import { AdminDashboardItems } from "@/components/admin-dashboard-items";
import { USER_CATEGORIES } from "@/utils/constants";

interface AppLayoutProps {
  children: ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  const { isLoading, data } = useGetCurrentUser();
  const { isLoading: clientDetailsLoading } = useGetClientDetails(
    data?.data.id
  );
  const logout = useLogout();

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
      padding="md"
      aside={
        <Navbar
          p={32}
          className="bg-primary-100 border-none order-1 left-0"
          width={{ sm: 200, lg: 300 }}
        >
          <section className="py-2 pt-4 h-full flex flex-col">
            <AppLogo />
            {isLoading ? dashboardSkeletons : dashboardItems}
            <div
              className="flex gap-4 items-center py-2 cursor-pointer"
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
      <section className="order-2 h-full w-full px-2 pt-5">{content}</section>
    </AppShell>
  );
}
