import EmptyTransactionListVector from "@/public/empty_transaction.svg";
import {
  Button,
  LoadingOverlay,
  Modal,
  Skeleton,
  Stack,
  Table,
} from "@mantine/core";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";
import { currencyFormatter } from "@/utils/currency";
import {
  IStatementHistory,
  IStatementRecord,
} from "@/utils/validators/interfaces";
import { AxiosResponse } from "axios";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import AppLogo from "@/public/logo.svg";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";


export function StatementsHistory({
  statementsHistory,
  statementsHistoryFetching,
  dateRange,
  setDateRange,
  meta,
}: {
  // isAdmin: boolean;
  statementsHistory: AxiosResponse<IStatementHistory> | undefined;
  statementsHistoryFetching: boolean;
  dateRange: [Date | null, Date | null];
  setDateRange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
  meta?: ReactNode;
}) {
  const [currentTransaction, setCurrentTransaction] =
    useState<IStatementRecord | null>(null);
  const { defaultGateway, isLoading: selectedGatewaysLoading } =
    useDefaultGateway();
  const { role } = useRole();
  const isAdmin = role === USER_CATEGORIES.ADMIN;
  let emptyTransactionHistory =
    statementsHistory?.data &&
    (statementsHistory?.data.result === null ||
      statementsHistory?.data.result?.length < 1);

    const handleDownloadExcel = () => {

      let data = statementsHistory?.data.result
      if (!data) {
        console.warn('No data available for Excel export');
        return null;
      }

      console.log(data);
      

      const excelData = data.map(exchange => ({

        'Tansaction Id': exchange.transactionId,
        "Transaction Date": exchange.transDate,
        'Debit': exchange.debit,
        "Credit": exchange.credit,
        "Balance": exchange.balance,
        "Narration": exchange.narration,
      }));

      if (excelData.length === 0) {
        console.warn('No data available for Excel export');
        return null;
      }

      const ws = XLSX.utils.json_to_sheet(excelData, { header: Object.keys(excelData[0]) });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
      XLSX.writeFile(wb, 'exchange_history.xlsx');
    };

  const handleDownloadPDF = (rowData) => {
    const pdf = new jsPDF();
  console.log(rowData);
  

    const lineHeight = 10;
    const marginLeft = 10;
    const textWidth = (pdf.internal.pageSize.getWidth() - 2 * marginLeft) ; // Adjust the width
console.log(textWidth);

  
    const formattedContent = `
      Manual Funding Details
  
      Transaction Id:              ${rowData.transactionId}
      Transaction Date:          ${rowData.transDate}
      Debit:                             ${rowData.debit}
      Credit:                            ${rowData.credit}
      Balance:                         ${rowData.balance}
      Narration:                     
    
    `;
  
    // Split the formatted content into lines
    const lines = formattedContent.split('\n');    
  console.log(lines);
  

    lines.forEach((line, index) => {
      pdf.text(line, marginLeft, lineHeight * (index + 1));
    });
  
     // Split the narration into multiple lines
  const narrationLines = pdf.splitTextToSize(rowData.narration, textWidth);
  narrationLines.forEach((narrationLine, index) => {
    pdf.text(narrationLine, 20, 8.5 * (lines.length + index + 1));
  });

    // Download the PDF
    pdf.save("transaction_receipt.pdf");
  };

  const createPDF = async () => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const data = await html2canvas(
      document.querySelector("#pdf") as HTMLElement
    );
    const img = data.toDataURL("image/png");
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("transaction_receipt.pdf");
  };

  const rows = useMemo(
    function () {
      return statementsHistory?.data.result?.map(function (statement) {
        // return tempData.map(function (statement) {
        return (
          <tr
            key={statement.transactionId}
            className="text-primary-100 font-medium font-secondary"
          >
            <td>{dayjs(statement.transDate).format("MMM D, YYYY h:mm A")}</td>
            <td>{statement.debit || 0}</td>
            <td>{statement.credit || 0}</td>
            <td>{statement.balance || 0}</td>
            <td>
              <Button
                variant="white"
                onClick={() => setCurrentTransaction(statement)}
              >
                View details
              </Button>
            </td>
            <td><button
            onClick={()=>handleDownloadPDF(statement)}
            >
              <FaDownload />
            </button></td>
          </tr>
        );
      });
    },
    [statementsHistory?.data.result]
  );

  if (!isAdmin && !defaultGateway) {
    return (
      <div className="flex-grow flex flex-col gap-2">
        <div className="bg-gray-30 rounded-lg border p-5 py-2 flex gap-4 items-center justify-between">
          <span className="text-primary-100 font-semibold mr-auto">
            Account statement
          </span>
          {meta}
          <DatePickerInput
            className="bg-white"
            type="range"
            value={dateRange}
            onChange={setDateRange}
          />
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
            Account statement
          </span>
          {meta}
          <DatePickerInput
            className="bg-white"
            type="range"
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <EmptyTransactionHistory message="Statement history empty" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-2">
      <div className="bg-gray-30 rounded-lg border p-5 py-2 flex gap-4 items-center justify-between">
        <span className="text-primary-100 font-semibold mr-auto">
          Account statement
        </span>

        {meta}

        <DatePickerInput
          className="bg-white"
          type="range"
          value={dateRange}
          onChange={setDateRange}
        />
                <button
  onClick={handleDownloadExcel}
  className=" bg-[#132144] hover:bg-[#132144] text-white font-bold py-2 px-4 rounded mr-2 z-50"
>
  Download Excel
</button>
      </div>
      <Skeleton
        visible={isAdmin ? statementsHistoryFetching : selectedGatewaysLoading}
        className="flex-grow"
      >
        <div className="flex-grow overflow-y-auto relative flex flex-col h-full">

        
          <LoadingOverlay visible={statementsHistoryFetching} />
      
          <Table
            verticalSpacing="xs"
            withBorder
            className="min-w-[600px] overflow-x-auto"
          >
            <thead>
              <tr className="font-primary font-light">
                <th>Date</th>
                <th>Debit (₦)</th>
                <th>Credit (₦)</th>
                <th>Balance (₦)</th>
                <th>View Details</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </Skeleton>

      <Modal
        size="lg"
        title="Transaction details"
        opened={!!currentTransaction}
        onClose={() => setCurrentTransaction(null)}
      >
        <div className="flex flex-col p-5 border" id="pdf">
          {/* <AppLogo /> */}
          <div className="py-4 flex justify-between text-base font-semibold border-b-2">
            <span>Balance:</span>
            <span>₦{currentTransaction?.balance || 0}</span>
          </div>
          <div className="py-4 flex justify-between text-base font-semibold border-b-2">
            <span>Credit:</span>
            <span>₦{currentTransaction?.credit || 0}</span>
          </div>
          <div className="py-4 flex justify-between text-base font-semibold border-b-2">
            <span>Debit:</span>
            <span>₦{currentTransaction?.debit || 0}</span>
          </div>
          <div className="py-4 flex justify-between text-base font-semibold border-b-2">
            <span>Transaction Date:</span>
            <span>
              {dayjs(currentTransaction?.transDate).format(
                "MMM D, YYYY h:mm A"
              )}
            </span>
          </div>
          <div className="py-4 flex justify-between text-base font-semibold border-b-2">
            <span>Narration</span>
            <span>{currentTransaction?.narration}</span>
          </div>
        </div>
        <Button
          fullWidth
          size="md"
          className="bg-primary-100 print:hidden mt-4"
          onClick={createPDF}
        >
          Download
        </Button>
      </Modal>
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
