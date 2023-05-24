import { ConvertIcon } from "@/components/icons";
import { AppLayout } from "@/layout/common/app-layout";
import styles from "@/styles/dashboard.module.css";
import { ReactElement } from "react";
import { Button, NumberInput, Select } from "@mantine/core";
import { TransactionHistory, Wallets } from "@/layout/dashboard";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className={"text-primary-100 text-2xl font-secondary"}>
        Thank you for choosing us, Wahab
      </h2>
      <section className="flex-grow flex gap-6">
        <section className="flex-grow flex flex-col gap-8">
          <Wallets />
          <TransactionHistory />
        </section>
        <div className="w-[350px] flex flex-col gap-6">
          <div className="bg-gray-30 border rounded-lg p-4">
            <section className="bg-white p-4 rounded border flex gap-4">
              <Select
                className="flex-grow"
                label="Currency"
                defaultValue="gbp"
                data={[
                  {
                    label: "USD",
                    value: "usd",
                  },
                  {
                    label: "GBP",
                    value: "gbp",
                  },
                  {
                    label: "EUR",
                    value: "eur",
                  },
                  {
                    label: "NGN",
                    value: "ngn",
                  },
                ]}
              />
              <NumberInput
                className="flex-grow"
                label="You send"
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )
                    : "$ "
                }
              />
            </section>
            <section className="h-24 flex items-center justify-center relative">
              <div className="absolute h-full w-5 bg-white mx-auto"></div>
              <div className="relative h-10 aspect-square rounded-full bg-white flex items-center justify-center">
                <ConvertIcon />
              </div>
            </section>
            <section className="bg-white p-4 rounded border flex gap-4">
              <Select
                className="flex-grow"
                label="Currency"
                defaultValue="gbp"
                data={[
                  {
                    label: "USD",
                    value: "usd",
                  },
                  {
                    label: "GBP",
                    value: "gbp",
                  },
                  {
                    label: "EUR",
                    value: "eur",
                  },
                  {
                    label: "NGN",
                    value: "ngn",
                  },
                ]}
              />
              <NumberInput
                className="flex-grow"
                label="You receive"
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )
                    : "$ "
                }
              />
            </section>

            <div className="text-primary-70 text-center my-5">
              Market Rate: 1 USD = 1.2 GBP
            </div>

            <Button className="bg-accent hover:bg-accent" size="md" fullWidth>
              Exchange
            </Button>
          </div>
          <div className={`${styles.worldBackground}`}>
            <span className="text-white">Link your account</span>
            <span className="text-accent">to Amazon, Paypal and more.</span>

            <a href="" className="mt-auto">
              <button className="px-3 py-2 border-2 border-accent rounded-md text-white">
                Learn more
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
