import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";

export default function Support() {
  return (
    <h2 className={"text-primary-100 text-2xl font-secondary"}>Support</h2>
  );
}

Support.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
