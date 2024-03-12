import { useGetCurrentUser } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
import { FXWallets } from "@/layout/dashboard/FXWallets";
import { ReactElement } from "react";
import CookieConsentBanner from "@/components/react-cookie-consent";
import Cookies from "js-cookie";

export default function Dashboard() {
  const { data } = useGetCurrentUser();
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";

  return (
    <div className="flex flex-col gap-6 min-h-full">

      <h2 className={" text-2xl font-secondary"}
      style={{ color: colorPrimary}}>
        Thank you for choosing us,{" "}
        <span className="font-semibold">{data?.data.last_name}</span>
      </h2>
      <section className="flex-grow flex flex-col lg:flex-row gap-6 h-full over-flow-auto overflow-y-auto">
        <section className="flex-grow flex flex-col gap-8 max-h-full lg:overflow-y-auto" >
          <FXWallets userId={data?.data.id} />
        </section>
      </section>
      <CookieConsentBanner />
    </div>
  );
}


Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
