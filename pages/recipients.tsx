import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";

export default function Recipients() {
  return (
    <h2 className={"text-primary-100 text-2xl font-secondary"}>Recipients</h2>
  );
}

Recipients.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
