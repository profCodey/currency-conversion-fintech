import dayjs from "dayjs";
import { useState } from "react";
import { Select } from "@mantine/core";
import { TransactionHistory } from "./transaction-history";
import { useGatewayOptions, useGetPayouts } from "@/api/hooks/gateways";

export function UserPayoutHistory({
  userId,
  gateway,
}: {
  userId: number;
  gateway?: string;
}) {
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
    useGetPayouts({
      begin_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
      end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
      gateway_id: gateway || currentGateway,
      user_id: userId.toString(),
    });

  const GatewayOptions = gateway ? null : (
    <Select
      defaultValue={gatewayOptions[0]?.value}
      data={gatewayOptions}
      placeholder="Select gateway"
      onChange={(value) => setCurrentGateway(value)}
    />
  );

  return (
    // Payout transaction history will not show options to select a gateway if a gateway is passed to it
    <div className="flex-grow max-h-full overflow-y-auto">
      <TransactionHistory
        dateRange={dateRange}
        setDateRange={setDateRange}
        payoutHistory={payoutHistory}
        payoutHistoryFetching={payoutHistoryFetching || gatewaysLoading}
        meta={GatewayOptions}
      />
    </div>
  );
}
