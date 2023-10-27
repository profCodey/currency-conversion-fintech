import { useDefaultGateway } from "@/api/hooks/gateways";
import { useGetCurrentUser } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
import { Statements } from "@/layout/transactions/statements";
import { ReactElement } from "react";

export default function Transactions() {
  const { data } = useGetCurrentUser();
  const { defaultGateway, isLoading } = useDefaultGateway();
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Account Statement</h2>
        <span>View Your Account Statement</span>
        <Statements
            userId={data!.data.id}
            gateway={String(defaultGateway?.gateway)}
          />
      </div>
    </div>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
