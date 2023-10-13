import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Select } from "@mantine/core";
import { TransactionHistory } from "./transaction-history";
import { useGetPayouts } from "@/api/hooks/gateways";
import { useClientSelectedGateways } from "@/api/hooks/admin/users";
import { ISelectedGateway } from "@/utils/validators/interfaces";

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

  const [cachedClientGateway, setCachedClientGateway] = useState<ISelectedGateway[] | null>(null);
  const {data:clientGateway, isLoading:clientGatewayLoading} = useClientSelectedGateways(userId.toString());

  useEffect(() => {
    // Check if clientGateway is defined and update the cached value
    if (clientGateway) {
      setCachedClientGateway(clientGateway.data);
    }
  }, [clientGateway]);

  const selectedGatewayData = clientGateway?.data ?? cachedClientGateway ?? [];
  const [clientGatewayId, setClientGatewayId] = useState<string | null>(
    selectedGatewayData[0]?.gateway.toString() || null
  )

  const { data: payoutHistory, isFetching: payoutHistoryFetching } =  
    useGetPayouts({
      begin_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
      end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
      gateway_id: gateway || clientGatewayId,
      user_id: userId.toString(),
    });

  const GatewayOptions = gateway ? null : (
    <Select
      defaultValue={selectedGatewayData[0]?.gateway?.toString()}
      data={selectedGatewayData.map((value) => {
        return {
          value: value.gateway?.toString(),
          label: value.gateway_name,
        };
      })}
      placeholder="Select gateway"
      onChange={(value) => setClientGatewayId(value)}
    />
  );

  return (
    // Payout transaction history will not show options to select a gateway if a gateway is passed to it
    <div className="flex-grow max-h-full h-full overflow-y-auto">
      <TransactionHistory
        dateRange={dateRange}
        setDateRange={setDateRange}
        payoutHistory={payoutHistory}
        payoutHistoryFetching={payoutHistoryFetching || clientGatewayLoading}
        meta={GatewayOptions}
      />
    </div>
  );
}
