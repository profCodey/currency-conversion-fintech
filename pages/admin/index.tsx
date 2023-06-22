import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";
import { useGetCurrentUser } from "@/api/hooks/user";
import { ActionIcon } from "@mantine/core";
import NotificationAlert from "@/public/notification-alert.svg";
import { Stats } from "@/layout/admin/stats";
import { TransactionsList } from "@/layout/admin/transaction-list";

export default function Dashboard() {
  const { data } = useGetCurrentUser();

  return (
    <div className="flex flex-col gap-6 h-full">
      <section className="flex justify-between">
        <div className="text-primary-100">
          <h2 className="text-2xl font-secondary">
            Thank you for choosing us,{" "}
            <span className="font-semibold">{data?.data.last_name}</span>
          </h2>
          <span>Manage and Monitor user’s Transaction daily.</span>
        </div>

        <ActionIcon>
          <NotificationAlert />
        </ActionIcon>
      </section>
      <Stats />
      <TransactionsList />
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
