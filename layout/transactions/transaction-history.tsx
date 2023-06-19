import EmptyTransactionListVector from "@/public/empty_transaction.svg";
import { LoadingOverlay, Table } from "@mantine/core";
import { useDefaultGateway, useGetPayouts } from "@/api/hooks/gateways";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";
import { currencyFormatter } from "@/utils/currency";

export function TransactionHistory() {
  const { defaultGateway, isLoading: selectedGatewaysLoading } =
    useDefaultGateway();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    const startDate = dayjs(new Date()).subtract(30, "days").toDate();
    const endDate = new Date();

    return [startDate, endDate];
  });

  const {
    data: payoutHistory,
    isLoading: payoutHistoryLoading,
    isFetching: payoutHistoryFetching,
  } = useGetPayouts({
    begin_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
    end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
    gateway_id: defaultGateway?.gateway,
  });

  let emptyTransactionHistory =
    payoutHistory?.data && payoutHistory?.data.result.length < 1;

  const _rows = useMemo(
    function () {
      return payoutHistory?.data.result.map(function (payout) {
        return (
          <tr key={payout.payoutId}>
            <td>{payout.narration}</td>
            <td>{payout.accountName}</td>
            <td>{dayjs(payout.createdOn).format("MMM D, YYYY h:mm A")}</td>
            <td>{currencyFormatter(Number(payout.amount))}</td>
            <td>{payout.status}</td>
            <td>{payout.charges}</td>
          </tr>
        );
      });
    },
    [payoutHistory?.data.result]
  );

  // if (emptyTransactionHistory) return <EmptyTransactionHistory />;
  return (
    <div className="flex-grow flex flex-col gap-2">
      <div className="bg-gray-30 rounded-lg border p-5 py-2 flex items-center justify-between">
        <span className="text-primary-100 font-semibold">Recent Payouts</span>

        <DatePickerInput
          className="bg-white"
          type="range"
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      <div className="flex-grow border overflow-y-auto relative flex flex-col">
        <LoadingOverlay
          visible={
            payoutHistoryFetching ||
            payoutHistoryLoading ||
            selectedGatewaysLoading
          }
        />
        {emptyTransactionHistory || !defaultGateway ? (
          <EmptyTransactionHistory
            message={
              defaultGateway
                ? "Your recent transaction will be shown here"
                : "Select a default gateway from config"
            }
          />
        ) : (
          <Table verticalSpacing="md">
            <thead>
              <tr className="font-primary font-light">
                <th>Last transaction</th>
                <th>Recipient</th>
                <th>Date</th>
                <th>Amount (₦)</th>
                <th>Status</th>
                <th>Charges</th>
              </tr>
            </thead>
            <tbody>{_rows}</tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export function EmptyTransactionHistory({ message }: { message: string }) {
  return (
    <div className="flex-grow bg-gray-30 rounded-lg border flex flex-col items-center justify-center gap-8 p-8">
      <span className="text-primary-100 text-xl font-secondary">{message}</span>
      <EmptyTransactionListVector />
    </div>
  );
}
