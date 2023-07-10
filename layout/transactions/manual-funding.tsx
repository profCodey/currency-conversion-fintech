import { useGetManualFundings } from "@/api/hooks/banks";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import { currencyFormatter, getCurrency } from "@/utils/currency";
import { IManualPayment } from "@/utils/validators/interfaces";
import { Box, Button, LoadingOverlay, Table } from "@mantine/core";
import { useMemo, useState } from "react";
import { FundingStatuses, ManualFundingDrawer } from "./manual-funding-drawer";

import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";

// TODO: Use one code instance of manual funding history table

export function ManualFundingHistory() {
  const [fundingData, setFundingData] = useState<IManualPayment | null>(null);
  const { data: manualFundings, isLoading: manualFundingsLoading } =
    useGetManualFundings();
  const { role, isLoading } = useRole();
  const isAdmin = role === USER_CATEGORIES.ADMIN;

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
      return manualFundings?.data.map(function (funding) {
        return (
          <tr key={funding.id}>
            <td className="flex gap-1 items-center">
              {getTransactionIcon(funding.status)} <span>{funding.status}</span>
            </td>
            <td>{funding.target_account_label}</td>
            <td>
              {getCurrency(funding?.currency) || ""}{" "}
              {currencyFormatter(Number(funding.amount))}
            </td>
            <td>{funding.sender_narration}</td>
            <td>{funding.category}</td>
            {isAdmin && (
              <td>
                <Button
                  variant="white"
                  className="px-0 text-accent my-auto"
                  onClick={() => setFundingData(funding)}
                >
                  Open
                </Button>
              </td>
            )}
          </tr>
        );
      });
    },
    [manualFundings?.data, isAdmin]
  );

  return (
    <Box className="flex-grow border h-full relative mt-4">
      <LoadingOverlay visible={manualFundingsLoading || isLoading} />
      <Table verticalSpacing="md">
        <thead>
          <tr>
            <th>Status</th>
            <th>Account Name</th>
            <th>Amount</th>
            <th>Narration</th>
            <th>Category</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      <ManualFundingDrawer
        fundingData={fundingData}
        closeDrawer={() => setFundingData(null)}
      />
    </Box>
  );
}
