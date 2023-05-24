import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";

export default function Settings() {
  return (
    <h2 className={"text-primary-100 text-2xl font-secondary"}>Settings</h2>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
