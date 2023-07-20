import { useGetManualFundings } from "@/api/hooks/banks";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import { currencyFormatter, getCurrency } from "@/utils/currency";
import { IManualPayment } from "@/utils/validators/interfaces";
import { Box, Button, LoadingOverlay, Table as MTable } from "@mantine/core";
import { useMemo, useState } from "react";
import { FundingStatuses, ManualFundingDrawer } from "./manual-funding-drawer";
import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Table from "@/components/table";

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
        return <TransactionFailedIcon className="scale-75" />;
      case "approved":
        return <TransactionCompletedIcon className="scale-75" />;
      case "pending":
        return <TransactionProcessingIcon className="scale-75" />;
      default:
        return null;
    }
  }

  const ColumnHelper = createColumnHelper<IManualPayment>();

  const columns = useMemo(function () {
    const genericColumns = [
      ColumnHelper.accessor("status", {
        header: "Status",
        id: "status",
        cell: (props) => (
          <div className="flex gap-1 items-center">
            <span className="hidden sm:visible">
              {getTransactionIcon(props.cell.getValue())}
            </span>
            <span>{props.cell.getValue()}</span>
          </div>
        ),
      }),
      ColumnHelper.accessor("target_account_label", { header: "Account" }),
      ColumnHelper.accessor("amount", {
        header: "Amount",
        id: "amount",
        cell: (props) => (
          <div className="flex">
            {getCurrency(props.row.original.currency) || ""}
            {currencyFormatter(Number(props.cell.getValue()))}
          </div>
        ),
      }),
      ColumnHelper.accessor("sender_narration", {
        header: "Narration",
        id: "sender_narration",
      }),
      ColumnHelper.accessor("category", { header: "Category" }),
    ];

    const adminColumns = [
      ColumnHelper.accessor("sender_name", { header: "Sender" }),
      ColumnHelper.accessor("id", {
        header: "Action",
        id: "action",
        cell: (props) => (
          <Button
            variant="white"
            className="px-0 text-accent my-auto"
            onClick={() => setFundingData(props.row.original)}
          >
            Open
          </Button>
        ),
      }),
    ];

    return isAdmin ? [...genericColumns, ...adminColumns] : genericColumns;
  }, []);

  // const rows = useMemo(
  //   function () {
  //     return manualFundings?.data.map(function (funding) {
  //       return (
  //         <tr key={funding.id}>
  //           <td className="flex gap-1 items-center">
  //             {getTransactionIcon(funding.status)}
  //             <span>{funding.status}</span>
  //           </td>
  //           <td>{funding.target_account_label}</td>
  //           <td>
  //             {getCurrency(funding?.currency) || ""}{" "}
  //             {currencyFormatter(Number(funding.amount))}
  //           </td>
  //           <td>{funding.sender_narration}</td>
  //           <td>{funding.category}</td>
  //           {isAdmin && (
  //             <td>
  //               <Button
  //                 variant="white"
  //                 className="px-0 text-accent my-auto"
  //                 onClick={() => setFundingData(funding)}
  //               >
  //                 Open
  //               </Button>
  //             </td>
  //           )}
  //         </tr>
  //       );
  //     });
  //   },
  //   [manualFundings?.data, isAdmin]
  // );

  return (
    <Box className="flex-grow h-full relative mt-4">
      <LoadingOverlay visible={manualFundingsLoading || isLoading} />
      <Table columns={columns} data={manualFundings?.data || []} />
      {/* <MTable verticalSpacing="md">
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
      </MTable> */}

      <ManualFundingDrawer
        fundingData={fundingData}
        closeDrawer={() => setFundingData(null)}
      />
    </Box>
  );
}
