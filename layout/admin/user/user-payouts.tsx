import {
  useGatewayOptions,
  useGetAllPayouts,
  useGetPayouts,
} from "@/api/hooks/gateways";
import { TransactionHistory as PayoutsHistory } from "@/layout/transactions/transaction-history";
import { Select, Tabs } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function UserPayouts({ id }: { id: number }) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    const startDate = dayjs(new Date()).subtract(30, "days").toDate();
    const endDate = new Date();

    return [startDate, endDate];
  });
  const { gatewayOptions, isLoading: gatewaysLoading } = useGatewayOptions();
  const [currentGateway, setCurrentGateway] = useState<string | null>(
    gatewayOptions[0]?.value || null
  );

  const { data: payoutHistory, isFetching: payoutHistoryFetching } =
    useGetAllPayouts({
      begin_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
      end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
      gateway_id: currentGateway,
    });

  useEffect(
    function () {
      if (currentGateway) {
        setCurrentGateway(currentGateway);
      }
    },
    [currentGateway]
  );

  return (
    <Tabs.Panel value="payouts" className="flex-grow">
      <div className="flex flex-col pt-4 h-full">
        <PayoutsHistory
          dateRange={dateRange}
          setDateRange={setDateRange}
          payoutHistory={payoutHistory}
          payoutHistoryFetching={payoutHistoryFetching}
          meta={
            <Select
              defaultValue={gatewayOptions[0].value}
              data={gatewayOptions}
              placeholder="Select gateway"
              onChange={(value) => setCurrentGateway(value)}
            />
          }
        />
      </div>
    </Tabs.Panel>
  );
}
