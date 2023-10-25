import { useFXWalletAccounts, useGetAccounts } from "@/api/hooks/accounts";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { useGetCurrentUser } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
import { FXWallets } from "@/layout/dashboard/FXWallets";
import { ReactElement } from "react";
import CookieConsentBanner from "@/components/react-cookie-consent";

export default function Dashboard() {
  const { data } = useGetCurrentUser();

  const { data: fxData } = useFXWalletAccounts();

  const { isLoading: walletsLoading, data: wallets } = useGetAccounts();

  const { defaultGateway, isLoading } = useDefaultGateway();

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <h2 className={"text-primary-100 text-2xl font-secondary"}>
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
