import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";
import { TransactionHistory, Wallets } from "@/layout/dashboard";
import { useGetCurrentUser } from "@/api/hooks/user";
import { RightSection } from "@/layout/dashboard/right-section";

export default function Dashboard() {
  const { data } = useGetCurrentUser();

  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className={"text-primary-100 text-2xl font-secondary"}>
        Thank you for choosing us,{" "}
        <span className="font-semibold">{data?.data.last_name}</span>
      </h2>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
