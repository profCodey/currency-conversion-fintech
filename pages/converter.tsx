import { AppLayout } from "@/layout/common/app-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Converter() {
  const router = useRouter();
  const transferData = router.query;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Converter</h2>
        <span>Fill in the amount you want to send</span>
      </div>
      <section className="flex-grow border-2 flex flex-col items-center justify-center">
        <div className="w-fit">
          <div className="p-4 bg-gray-30 rounded-lg border text-gray-90 flex flex-col gap-2">
            <p>Account Name {transferData?.ac}</p>
            <p>Account Number {transferData?.acn}</p>
          </div>
          <div className="p-4">
            <p>Amount {transferData?.am}</p>
            <p>Currency {transferData?.cr}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

Converter.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
