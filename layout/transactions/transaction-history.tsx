import React, { useEffect, useState } from "react";
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
// import TransactionModal from "./transactionModal";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";

import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { useGetBasicProfile } from "@/api/hooks/onboarding";

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
  const [companyName, setCompanyName] = useState<string>("");
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
  // Variable to store the modal content
  // const transactionModalContent = Object.entries(transactionModalState).map(
  //   ([payoutId, showModal]) =>
  //     showModal && (
  //       <TransactionModal
  //         key={payoutId}
  //         payout={payoutHistory?.data.result?.find(
  //           (payout) => payout.payoutId === payoutId
  //         )}
  //       />
  //     )
  // );

  const userId : string | number | undefined = Cookies.get("pycl_user_id");
  const companyInfo = useGetBasicProfile(Number(userId));
  const company = companyInfo.data?.data.business_trading_name;


  

  // Function to capture HTML content using html2canvas
  // const captureHTML = async () => {
  //   const element = document.getElementById("pdf-content");
  //   const canvas = await html2canvas(element);
  //   return canvas.toDataURL("image/png");
  // };

  const createPDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");

    // Set font size for better readability
    pdf.setFontSize(16); 
    pdf.setFontSize(10);

    // Use html2canvas to capture the content of the TransactionModal
    const modalElement = document.getElementById("transaction-modal-content");
    if (!modalElement) {
      console.error("Modal element not found");
      return;
    }

    const modalCanvas = await html2canvas(modalElement);

    const scaleFactor = 0.4; // Adjust this value as needed
    const scaledWidth = modalCanvas.width * scaleFactor;
    const scaledHeight = modalCanvas.height * scaleFactor;

    // Add the captured image to the PDF
    pdf.addImage(
      modalCanvas.toDataURL("image/png"),
      "PNG",
      80,
      80,
      scaledWidth,
      scaledHeight
    );

    // Save the PDF
    pdf.save("transaction_receipt.pdf");
  };

  const handleDownloadModal = (payoutId: string) => {
    setTransactionModalState((prevState) => ({
      ...prevState,
      [payoutId]: !prevState[payoutId], // Toggle the state
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

  interface TransactionDetailsContentProps {
    payout: any; 
  }
  
  const TransactionDetailsContent: React.FC<TransactionDetailsContentProps> = ({ payout }) => (
    <div id="transaction-modal-content" className="h-[600px] w-full">
      <div className="flex gap-72 w-full">
        <div className="flex mb-1 w-60">
          <p className="text-4xl font-bold">{company}</p>
        </div>
        <div className="text-right ">
          <div className="text-right w-full">
            <h2 className="text-2xl font-bold mb-6 ">Transaction Details</h2>
          </div>
          <div className="flex text-right mr-2">
            <p className="text-sm mt-[-10px] mb-8 ml-32">
              {new Date(payout.createdOn).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex bg-[#ebebeb] w-full pl-2 h-8 mt-[-15px] mb-8 text-sm mr-2">
            <p className="ml-36">Status:&nbsp;</p> <p>{payout.status}</p>
          </div>
        </div>
      </div>
      <div className="text-l mt-6">
        <div className="flex mb-1">
          <p className="w-52 font-bold">Amount:</p> <p>{payout.amount}</p>
        </div>

        <div className="flex mb-1">
          <p className="w-52 font-bold">Transaction ID:</p>{" "}
          <p>{payout.transactionId}</p>
        </div>
        <div className="flex mb-1">
          <p className="w-52 font-bold">Payment Reference:</p>
          <p> {payout.payoutId}</p>
        </div>
        <p className="mt-8 mb-2 font-bold text-xl">Recipient Details</p>
        <div className="flex mb-2">
          <p className="w-52 flex gap-2 font-bold">
            <p>Bank</p> <p className="font-bold">Name:</p>
          </p>{" "}
          <p>{payout.bankname}</p>
        </div>
        <div className="flex mb-2">
          <p className="w-52 flex gap-2 font-bold">
            <p>Account</p> <p className="font-bold">Name:</p>
          </p>
          <p>{payout.accountName}</p>
        </div>
        <div className="flex mb-8">
          <p className="w-52 flex gap-2 font-bold">
            <p>Account</p> <p className="font-bold">Number:</p>
          </p>{" "}
          <p>{payout.accountNumber}</p>
        </div>
      </div>
    </div>
  );

  // Function to handle exporting table data to Excel
  const exportToExcel = () => {
    const info = payoutHistory?.data.result.map((info) => {
      return {
        gatewaywalletbalanceAfter: info.gatewaywalletbalanceAfter,
        "Wallet Balance After": info.walletbalanceAfter,
        "Status Date": info.statusDate,
        "Gateway Id": info.gatewayid,
        "Client Id": info.clientId,
        "Payout Id": info.payoutId,
        "Bank Code": info.bankcode,
        bankname: info.bankname,
        accountNumber: info.accountNumber,
        accountName: info.accountName,
        amount: info.amount,
        transactionId: info.transactionId,
        status: info.status,
        statusRemarks: info.statusRemarks,
        gatewayref: info.gatewayref,
        charges: info.charges,
        narration: info.narration,
        createdOn: info.createdOn,
      };
    });

    if (!info) {
      console.error("No data to export.");
      return;
    }
  

    const ws = XLSX.utils.json_to_sheet(info);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payout History");
    XLSX.writeFile(wb, "payout_history.xlsx");
  };

  const _rows = useMemo(
    function () {
      html2canvas;
      return payoutHistory?.data.result
        ?.map(function (payout) {
          const isModalOpen = transactionModalState[payout.payoutId];
          return (
            <React.Fragment key={payout.payoutId}>
              <div style={{ position: 'absolute', left: '-9999px' }}>
                <TransactionDetailsContent payout={payout} />
              </div>
              {/* {isModalOpen && (
                <>
                  <TransactionDetailsContent payout={payout} />
                </>
              )} */}
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
                    onClick={() =>
                      createPDF()
                    }
                    className="cursor-pointer"
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
          <button
            className="text-white bg-primary-100 p-2 rounded"
            onClick={exportToExcel}
          >
            Download Excel
          </button>
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
        <button
          className="bg-primary-100 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={exportToExcel}
        >
          Download Excel
        </button>
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
