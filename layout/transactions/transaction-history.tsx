import EmptyTransactionListVector from "@/public/empty_transaction.svg";
import {
  Group,
  LoadingOverlay,
  Select,
  Skeleton,
  Stack,
  Table,
} from "@mantine/core";
import {
  useDefaultGateway,
  useGatewayOptions,
  useGetPayouts,
} from "@/api/hooks/gateways";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";
import { currencyFormatter } from "@/utils/currency";
import {
  IPayoutHistory,
  PayoutRecordStatuses,
} from "@/utils/validators/interfaces";

import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";
// import { useGetCurrentUser, useRole } from "@/api/hooks/user";
// import { USER_CATEGORIES } from "@/utils/constants";
import { AxiosResponse } from "axios";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";

export function TransactionHistory({
  // isAdmin,
  payoutHistory,
  payoutHistoryFetching,
  dateRange,
  setDateRange,
  meta,
}: {
  // isAdmin: boolean;
  payoutHistory: AxiosResponse<IPayoutHistory> | undefined;
  payoutHistoryFetching: boolean;
  dateRange: [Date | null, Date | null];
  setDateRange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
  meta?: ReactNode;
}) {
  const { defaultGateway, isLoading: selectedGatewaysLoading } =
    useDefaultGateway();
  const { role } = useRole();
  // const [currentGateway, setCurrentGateway] = useState<string | null>(null);
  const isAdmin = role === USER_CATEGORIES.ADMIN;
  let emptyTransactionHistory =
    payoutHistory?.data &&
    (payoutHistory?.data.result === null ||
      payoutHistory?.data.result?.length < 1);

  function getTransactionIcon(status: PayoutRecordStatuses) {
    switch (status) {
      case "FailedDuringSend":
      case "Failed":
      case "UnResolvable":
        return <TransactionFailedIcon className="scale-75" />;
      case "Paid":
        return <TransactionCompletedIcon className="scale-75" />;
      case "SentToGateway":
      case "Pending":
        return <TransactionProcessingIcon className="scale-75" />;
      default:
        return null;
    }
  }

  function getTransactionStatus(status: PayoutRecordStatuses) {
    switch (status) {
      case "FailedDuringSend":
      case "Failed":
        return "Failed";
      case "UnResolvable":
        return "Unresolved";
      case "Paid":
        return "Completed";
      case "SentToGateway":
        return "Processing";
      default:
        return status;
    }
  }

  const _rows = useMemo(
    function () {
      return payoutHistory?.data.result
        ?.map(function (payout) {
          return (
            <tr key={payout.payoutId}>
              <td>
                <Group>
                  {getTransactionIcon(payout.status)}
                  <Stack spacing={0}>
                    <span>{payout.narration}</span>
                    <span>{getTransactionStatus(payout.status)}</span>
                  </Stack>
                </Group>
              </td>
              <td>{payout.accountName}</td>
              <td>{dayjs(payout.createdOn).format("MMM D, YYYY h:mm A")}</td>
              <td>{currencyFormatter(Number(payout.amount))}</td>
              <td>{payout.charges}</td>
            </tr>
          );
        })
        .reverse();
    },
    [payoutHistory?.data.result]
  );

  if (!isAdmin && !defaultGateway) {
    return (
      <div className="flex-grow flex flex-col gap-2">
        <div className="bg-gray-30 rounded-lg border p-5 py-2 flex gap-4 items-center justify-between">
          <span className="text-primary-100 font-semibold mr-auto">
            Recent Payouts
          </span>
          {meta}
          <DatePickerInput
            className="bg-white"
            type="range"
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <EmptyTransactionHistory message="Select a default gateway from config" />
      </div>
    );
  }

  if (emptyTransactionHistory) {
    return (
      <div className="flex-grow flex flex-col gap-2 h-full">
        <div className="bg-gray-30 rounded-lg border p-5 py-2 flex gap-4 items-center justify-between">
          <span className="text-primary-100 font-semibold mr-auto">
            Recent Payouts
          </span>
          {meta}
          <DatePickerInput
            className="bg-white"
            type="range"
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <EmptyTransactionHistory message="Transaction history empty" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-2">
      <div className="bg-gray-30 rounded-lg border p-5 py-2 flex gap-4 items-center justify-between">
        <span className="text-primary-100 font-semibold mr-auto">
          Recent Payouts
        </span>

        {meta}

        <DatePickerInput
          className="bg-white"
          type="range"
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      <Skeleton
        visible={isAdmin ? payoutHistoryFetching : selectedGatewaysLoading}
        className="flex-grow"
      >
        <div className="flex-grow overflow-y-auto relative flex flex-col h-full">
          <LoadingOverlay visible={payoutHistoryFetching} />
          <Table verticalSpacing="md" withBorder>
            <thead>
              <tr className="font-primary font-light">
                <th>Last transaction</th>
                <th>Recipient</th>
                <th>Date</th>
                <th>Amount (₦)</th>
                <th>Charges</th>
              </tr>
            </thead>
            <tbody>{_rows}</tbody>
          </Table>
        </div>
      </Skeleton>
    </div>
  );
}

export function EmptyTransactionHistory({ message }: { message: string }) {
  return (
    <div className="flex-grow bg-gray-30 rounded-lg border flex flex-col items-center justify-center gap-8 p-8 h-full">
      <span className="text-primary-100 text-xl font-secondary">{message}</span>
      <EmptyTransactionListVector />
    </div>
  );
}
