import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";

export default function Converter() {
  return (
    <h2 className={"text-primary-100 text-2xl font-secondary"}>Converter</h2>
  );
}

Converter.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
