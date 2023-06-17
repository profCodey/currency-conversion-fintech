import Image from "next/image";
import EmptyTransactionListVector from "@/public/empty_transaction.svg";
import { LoadingOverlay, Table } from "@mantine/core";
import {
  useGetGateways,
  useGetPayouts,
  useGetSelectedGateways,
} from "@/api/hooks/gateways";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { DateInput, DatePickerInput } from "@mantine/dates";

const transactions = [
  {
    id: "1",
    transactionType: "Payment",
    status: "processing",
    recipient: "Bank A",
    date: "07-01-2020",
    amountSent: "$5,000",
    amountReceived: "$4,800",
  },
  {
    id: "2",
    transactionType: "Transfer",
    status: "cancelled",
    recipient: "Bank B",
    date: "12-05-2020",
    amountSent: "$2,500",
    amountReceived: "$2,400",
  },
  {
    id: "3",
    transactionType: "Withdrawal",
    status: "completed",
    recipient: "Bank C",
    date: "03-22-2021",
    amountSent: "$1,200",
    amountReceived: "$1,150",
  },
  {
    id: "4",
    transactionType: "Payment",
    status: "completed",
    recipient: "Bank D",
    date: "09-14-2022",
    amountSent: "$3,800",
    amountReceived: "$3,650",
  },
  {
    id: "5",
    transactionType: "Transfer",
    status: "processing",
    recipient: "Bank E",
    date: "06-30-2023",
    amountSent: "$7,500",
    amountReceived: "$7,200",
  },
  {
    id: "6",
    transactionType: "Payment",
    status: "cancelled",
    recipient: "Bank F",
    date: "11-08-2023",
    amountSent: "$4,300",
    amountReceived: "$4,100",
  },
];

export function TransactionHistory() {
  const { data: selectedGateways, isLoading: selectedGatewaysLoading } =
    useGetSelectedGateways();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    const startDate = dayjs(new Date()).subtract(30, "days").toDate();
    const endDate = new Date();

    return [startDate, endDate];
  });
  const [startDate, endDate] = dateRange;
  const defaultGateway = useMemo(
    function () {
      return selectedGateways?.data.find((gateway) => gateway.is_default);
    },
    [selectedGateways?.data]
  );

  if (selectedGateways?.data && !defaultGateway) {
  }

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
            <td>{payout.amount}</td>
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
      <div className="bg-gray-30 rounded-lg border p-5 flex items-center justify-between">
        <span className="text-primary-100 font-semibold">Recent Payouts</span>

        <DatePickerInput
          className="bg-white"
          type="range"
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      <div className="flex-grow border overflow-y-auto relative flex flex-col">
        <LoadingOverlay visible={payoutHistoryFetching} />
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
                <th>Amount</th>
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

function EmptyTransactionHistory({ message }: { message: string }) {
  return (
    <div className="flex-grow bg-gray-30 rounded-lg border flex flex-col items-center justify-center gap-8 p-8">
      <span className="text-primary-100 text-xl font-secondary">{message}</span>
      <EmptyTransactionListVector />
    </div>
  );
}
