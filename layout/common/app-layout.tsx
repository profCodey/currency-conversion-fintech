import { DashboardItems } from "@/components/dashboard-items";
import { LogoutIcon } from "@/components/icons";
import { AppShell, Aside, Navbar } from "@mantine/core";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  console.log("Applayout was reloaded")
  return (
    <AppShell
      padding="md"
      aside={
        <Aside
          p={32}
          className="bg-primary-100 border-none order-1 left-0"
          width={{ sm: 200, lg: 300 }}
        >
          <section className="py h-full flex flex-col">
            <div className="text-3xl font-semibold text-slate-300">LOGO</div>

            <DashboardItems />

            <div className="flex gap-4 items-center py-2" tabIndex={0}>
              <LogoutIcon />
              <span className="text-slate-400 text-lg">Logout</span>
            </div>
          </section>
        </Aside>
      }
    >
      <section className="order-2 h-full w-full ml-[200px] lg:ml-[300px] px-2 pt-5">
        {children}
      </section>
    </AppShell>
  );
}
