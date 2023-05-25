import { AppLayout } from "@/layout/common/app-layout";
import { AccountDetails, CurrencySelect } from "@/layout/fund-account";
import { Button, Progress, Stack } from "@mantine/core";
import { ReactElement, useState } from "react";

export default function FundAccount() {
  const [progressValue, setProgressValue] = useState<number>(3);

  function handleNext() {
    setProgressValue((prev) => prev - 1);
  }

  function handleSubmit() {}

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Fund Wallet</h2>
        <span>fund your wallet in 3 steps</span>
      </div>

      <Progress
        aria-label="Funding progress"
        classNames={{ bar: "bg-accent" }}
        value={100 / progressValue}
        size="xl"
        radius="lg"
      />

      <form>
        {progressValue === 3 && <CurrencySelect handleNext={handleNext} />}
        {progressValue === 2 && <AccountDetails handleNext={handleNext} />}
        {progressValue === 1 && (
          <Stack>
            <span className="text-gray-90">
              Pay Into The Account Below and Click on Next After Payment to fund
              your wallet
            </span>
            <Button
              className="bg-primary-100 hover:bg-primary-100 mt-2 w-[350px]"
              size="md"
              onClick={handleSubmit}
            >
              Submit Payment
            </Button>
          </Stack>
        )}
      </form>
    </div>
  );
}

FundAccount.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
