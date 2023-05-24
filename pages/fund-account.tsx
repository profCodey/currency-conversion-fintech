import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";

export default function FundAccount() {
  return (
    <h2 className={"text-primary-100 text-2xl font-secondary"}>Fund Account</h2>
  );
}

FundAccount.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
