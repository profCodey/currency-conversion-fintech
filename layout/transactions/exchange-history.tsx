import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useGetExchanges } from "@/api/hooks/exchange";
import { Button, Skeleton, Table } from "@mantine/core";
import { FxExchangeDetail } from "./fx-exchange-detail";
import { IExchangeDetailed } from "@/utils/validators/interfaces";

import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";
import { FundingStatuses } from "./manual-funding-drawer";

export function ExchangeHistory() {
  const [exchange, setExchange] = useState<IExchangeDetailed | null>(null);
  const { data: exchanges, isLoading } = useGetExchanges();

  function getTransactionIcon(status: FundingStatuses) {
    switch (status) {
      case "cancelled":
      case "rejected":
        return <TransactionFailedIcon className="scale-50" />;
      case "approved":
        return <TransactionCompletedIcon className="scale-50" />;
      case "pending":
        return <TransactionProcessingIcon className="scale-50" />;
      default:
        return null;
    }
  }
  const rows = useMemo(
    function () {
      return exchanges?.data?.map(function (exchange) {
        return (
          <tr key={exchange.id}>
            <td className="flex gap-1 items-center">
              {getTransactionIcon(exchange.status)}{" "}
              <span>{exchange.status}</span>
            </td>
            <td>{exchange.created_by_name}</td>
            <td>{exchange.amount}</td>
            <td>{dayjs(exchange.created_on).format("MMM D, YYYY h:mm A")}</td>
            <td>{exchange.rate}</td>
            <td>{exchange.source_account_detail?.label}</td>
            <td>{exchange.destination_account_detail?.label}</td>
            <td>
              <Button
                size="xs"
                variant="white"
                onClick={() => setExchange(exchange)}
              >
                Details
              </Button>
            </td>
          </tr>
        );
      });
    },
    [exchanges?.data]
  );

  return (
    <Skeleton visible={isLoading} className="flex-grow">
      <div className="flex-grow overflow-y-auto relative flex flex-col h-full">
        <Table verticalSpacing="md" withBorder>
          <thead>
            <tr className="font-primary font-light">
              <th>Status</th>
              <th>Created By</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Rate</th>
              <th>Source account</th>
              <th>Destination account</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <FxExchangeDetail
          open={!!exchange}
          exchange={exchange}
          closeDrawer={() => setExchange(null)}
        />
      </div>
    </Skeleton>
  );
}
