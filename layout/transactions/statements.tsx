import dayjs from "dayjs";
import { useState } from "react";
import { Select } from "@mantine/core";
import { useGatewayOptions, useGetStatements } from "@/api/hooks/gateways";
import { StatementsHistory } from "./statements-history";

export function Statements({
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

  const { data: statementHistory, isFetching: statementHistoryLoading } =
    useGetStatements({
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
    // Statements transaction history will not show options to select a gateway if a gateway is passed to it
    <div className="flex-grow max-h-full h-full overflow-y-auto">
      <StatementsHistory
        dateRange={dateRange}
        setDateRange={setDateRange}
        statementsHistory={statementHistory}
        statementsHistoryFetching={statementHistoryLoading || gatewaysLoading}
        meta={GatewayOptions}
      />
    </div>
  );
}
