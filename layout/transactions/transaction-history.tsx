import React, { useState } from "react";
import EmptyTransactionListVector from "@/public/empty_transaction.svg";
import { Group, LoadingOverlay, Skeleton, Stack, Table } from "@mantine/core";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";
import { currencyFormatter } from "@/utils/currency";
import {
  IPayoutHistory,
  PayoutRecordStatuses,
} from "@/utils/validators/interfaces";
import { AxiosResponse } from "axios";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";

import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";
import { FaDownload } from "react-icons/fa6";
import TransactionModal from "./transactionModal";
import { jsPDF } from "jspdf";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
export function TransactionHistory({
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
  // const [transactionModalState, setTransactionModalState] = useState(false);
  const [transactionModalState, setTransactionModalState] = useState<{
    [payoutId: string]: boolean;
  }>({});

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
        return <TransactionProcessingIcon />;
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

  const createPDF = async (payout) => {
    const pdf = new jsPDF("portrait", "pt", "a4");

    // Set font size for better readability
    pdf.setFontSize(16); // Increase font size for the page title

    // Add page title
    pdf.text("TRANSFER CONFIRMATION", 50, 50);

    // Set font size for other content
    pdf.setFontSize(12);

    // Add payout details
    pdf.text(`Date: ${payout.createdOn}`, 50, 80);
    pdf.text(`Status: ${payout.status}`, 50, 100);

    // Add a line break before the next section
    pdf.text("", 50, 120);

    // Add content to the PDF
    pdf.text(`Amount: ${payout.amount}`, 50, 140);
    pdf.text(`Transaction ID: ${payout.transactionId}`, 50, 160);
    pdf.text(`Payment Reference: ${payout.payoutId}`, 50, 180);

    // Add a line break before recipient details
    pdf.text("", 50, 200);
    pdf.text("Recipient Details", 50, 220);

    // Recipient details
    pdf.text(`Bank Name: ${payout.bankname}`, 50, 240);
    pdf.text(`Account Name: ${payout.accountName}`, 50, 260);
    pdf.text(`Account Number: ${payout.accountNumber}`, 50, 280);

    // Save the PDF
    pdf.save("transaction_receipt.pdf");
  };

  const handleCloseModal = (payoutId: string) => {
    setTransactionModalState((prevState) => ({
      ...prevState,
      [payoutId]: !prevState[payoutId],
    }));
  };
  // CSV data for the CSVLink component
  const csvData = useMemo(() => {
    if (!payoutHistory?.data?.result) return [];

    return payoutHistory.data.result.map((payout) => ({
      "Last transaction": payout.narration,
      "Transfer Id": payout.transactionId,
      Recipient: payout.accountName,
      Date: dayjs(payout.createdOn).format("MMM D, YYYY h:mm A"),
      "Amount (₦)": currencyFormatter(Number(payout.amount)),
      Charges: payout.charges,
    }));
  }, [payoutHistory?.data?.result]);

  // Function to handle exporting table data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payout History");
    XLSX.writeFile(wb, "payout_history.xlsx");
  };

  const _rows = useMemo(
    function () {
      return payoutHistory?.data.result
        ?.map(function (payout) {
          return (
            <React.Fragment key={payout.payoutId}>
              {transactionModalState[payout.payoutId] && (
                <TransactionModal
                  payout={payout}
                  handleCloseModal={handleCloseModal}
                  createPDF={createPDF}
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Transaction Details
                    </h2>
                    <p>Date: {payout.createdOn}</p>
                    <p>Status: {payout.status}</p>
                    <p>Amount: {payout.amount}</p>
                    <p>Transaction ID: {payout.transactionId}</p>
                    <p>Payment Reference: {payout.payoutId}</p>

                    <p className="mt-4 mb-2 font-bold">Recipient Details</p>
                    <p>Bank Name: {payout.bankname}</p>
                    <p>Account Name: {payout.accountName}</p>
                    <p>Account Number: {payout.accountNumber}</p>
                  </div>
                </TransactionModal>
              )}
              <tr className="text-primary-100 font-medium">
                <td className="text-xs sm:text-base">
                  <Group spacing="xs">
                    <span className="hidden sm:block">
                      {getTransactionIcon(payout.status)}
                    </span>
                    <Stack spacing={0}>
                      <span className="font-medium text-primary-100">
                        {payout.narration}
                      </span>
                      <span className="text-primary-70">
                        {getTransactionStatus(payout.status)}
                      </span>
                    </Stack>
                  </Group>
                </td>
                <td>{payout.transactionId}</td>
                <td>{payout.accountName}</td>
                <td>{dayjs(payout.createdOn).format("MMM D, YYYY h:mm A")}</td>
                <td>{currencyFormatter(Number(payout.amount))}</td>
                <td>{payout.charges}</td>
                <td>
                  <span
                    className=""
                    onClick={() => handleCloseModal(payout.payoutId)}
                  >
                    <FaDownload />
                  </span>
                </td>
              </tr>
            </React.Fragment>
          );
        })
        .reverse();
    },
    [payoutHistory?.data.result, transactionModalState]
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

          {/* Button to download table in Excel format */}
          <button onClick={exportToExcel}>Download Excel</button>
          {/* CSVLink component for downloading table in CSV format */}
          <CSVLink
            data={csvData}
            filename={"payout_history.csv"}
            className="text-white bg-blue-500 p-2 rounded"
          >
            Download CSV
          </CSVLink>
        </div>
        <EmptyTransactionHistory
          message={
            <Stack align="center">
              <h3>Select a default gateway from config</h3>
              <p className="text-red-600">
                Click on config from the sidebar and make a gateway as default
              </p>
            </Stack>
          }
        />
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

        {/* Button to download table in Excel format */}
        <button onClick={exportToExcel}>Download Excel</button>
        {/* CSVLink component for downloading table in CSV format */}
        <CSVLink
          data={csvData}
          filename={"payout_history.csv"}
          className="text-white bg-blue-500 p-2 rounded"
        >
          Download CSV
        </CSVLink>
      </div>
      <Skeleton
        visible={isAdmin ? payoutHistoryFetching : selectedGatewaysLoading}
        className="flex-grow"
      >
        <div className="flex-grow overflow-y-auto relative flex flex-col h-full">
          <LoadingOverlay visible={payoutHistoryFetching} />
          <Table
            verticalSpacing="xs"
            withBorder
            className="min-w-[600px] overflow-x-auto"
          >
            <thead>
              <tr className="font-primary font-light">
                <th>Last transaction</th>
                <th>Transfer Id</th>
                <th>Recipient</th>
                <th>Date</th>
                <th>Amount (₦)</th>
                <th>Charges</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>{_rows}</tbody>
          </Table>
        </div>
      </Skeleton>
    </div>
  );
}

export function EmptyTransactionHistory({ message }: { message: ReactNode }) {
  return (
    <div className="flex-grow bg-gray-30 rounded-lg border flex flex-col items-center justify-center gap-8 p-8 h-full">
      <span className="text-primary-100 text-xl font-secondary">{message}</span>
      <EmptyTransactionListVector />
    </div>
  );
}
