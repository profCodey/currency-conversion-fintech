import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";
import { useGetCurrentUser } from "@/api/hooks/user";
import { Stats } from "@/layout/admin/stats";
import { TransactionsList } from "@/layout/admin/transaction-list";
import { PageHeader } from "@/components/admin/page-header";
import CookieConsentBanner from "@/components/react-cookie-consent";

export default function Dashboard() {
  const { data } = useGetCurrentUser();

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader
        header={
          <>
            <span>Thank you for choosing us, </span>
            <span className="font-semibold">{data?.data.last_name}</span>
          </>
        }
        subheader="Manage and Monitor user’s Transaction daily."
      />
      <Stats />
      <TransactionsList />
      <CookieConsentBanner />
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
