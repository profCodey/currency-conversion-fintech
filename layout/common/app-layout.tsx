import { ErrorItem, useGetRefreshToken, useLogout } from "@/api/hooks/auth";
import { useGetCurrentUser } from "@/api/hooks/user";
import { DashboardItems } from "@/components/dashboard-items";
import { LogoutIcon } from "@/components/icons";
import { AppShell, Aside, Navbar } from "@mantine/core";
import { Text, Loader } from "@mantine/core";
import { modals, closeAllModals } from "@mantine/modals";
import { ReactNode, useEffect } from "react";
import AppLogo from "@/public/logo-light.svg";
import { useGetBasicProfile } from "@/api/hooks/onboarding";

interface AppLayoutProps {
  children: ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  const { isLoading, data, isError } = useGetCurrentUser();
  // const { isLoading: basicProfileLoading } = useGetBasicProfile(data?.data.id);
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

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center gap-4">
        <span>Loading application...</span>{" "}
        <Loader size="lg" variant="bars" color="green" />
      </div>
    );
  }

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
            <DashboardItems />
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
      <section className="order-2 h-full w-full px-2 pt-5">{children}</section>
    </AppShell>
  );
}
