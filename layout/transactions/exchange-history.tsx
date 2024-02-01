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
import * as XLSX from 'xlsx';
import { FaDownload } from "react-icons/fa6";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";
import { EmptyTransactionHistory } from "./transaction-history";

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

  let emptyTransactionHistory =
    exchanges?.data &&
    (exchanges?.data === null ||
      exchanges?.data.length < 1);

  type exchangeHistory = Record<string, string | number> & {
    source_account_detail: {
      label: string;
      category: string;
      currency: {
        name: string;
  };
  true_balance: string

    }
    destination_account_detail: {
      label: string;
      category: string;
      currency: {
        name: string;
      };
      true_balance: string;
    }
  }

function handlePDFDonwload(data: IExchangeDetailed){
    const pdf = new jsPDF();
  
    const lineHeight = 7;
    const marginLeft = 10;
  
    const formattedContent = `
      Exchange Details
  
      User:                            ${data.created_by_name}
      Id:                                 ${data.id}
      Status:                          ${data.status}
      Date Created:               ${data.created_on}
      Rate:                            ${data.rate}

      Destination Account
      
      Account:                        ${data.destination_account_detail.label}
      Category:                       ${data.destination_account_detail.category}
      Currency:                       ${data.destination_account_detail.currency.name}
      Bank Name:                   ${data.source_account_detail.bank_name}
      Account Name:              ${data.source_account_detail.account_name}
      Account Number:           ${data.source_account_detail.account_number}
      Balance:                        ${data.destination_account_detail.true_balance}

    `;
  
    // Split the formatted content into lines
    const lines = formattedContent.split('\n');    
  
    // Add each line to the PDF
    lines.forEach((line, index) => {
      pdf.text(line, marginLeft, lineHeight * (index + 1));
    });
  
    // Download the PDF
    pdf.save("transaction_receipt.pdf");
  };
  
  const handleDownloadExcel = () => {
    if (!exchanges || !exchanges.data) {
      console.warn('No data available for Excel export');
      return null;
    }
    const excelData = exchanges.data.map(exchange => ({
      Status: exchange.status,
      'Created By': exchange.created_by_name,
      Amount: exchange.amount,
      Date: dayjs(exchange.created_on).format("MMM D, YYYY h:mm A"),
      Rate: exchange.rate,
      'Source Account': exchange.source_account_detail?.label,
      "Source Currency": exchange.source_account_detail.currency.name,
      "Source Category": exchange.source_account_detail.category,
      "Source Balance": exchange.source_account_detail.true_balance,
      'Destination Account': exchange.destination_account_detail?.label,
      "Destination Currency": exchange.destination_account_detail?.currency.name,
      "Destination Category": exchange.destination_account_detail?.category,
      "Destination Balance": exchange.destination_account_detail?.true_balance,
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
            <td>
              <Button
                size="xs"
                variant="white"
                onClick={() => handlePDFDonwload(exchange)}
              >
                <FaDownload color="#132144"/>
              </Button>
            </td>
          </tr>
        );
      });
    },
    [exchanges?.data]
  );

if (emptyTransactionHistory) {
  return (
      <div className="mt-6">
          <EmptyTransactionHistory message="Exchange history empty" />
      </div>
  );
}

  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  
  return (
    <Skeleton visible={isLoading} className="flex-grow">
      <div className="flex-grow overflow-y-auto relative flex flex-col h-full">
        <Table verticalSpacing="md" withBorder className="relative  top-16">
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
              <th>Download</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <FxExchangeDetail
          open={!!exchange}
          exchange={exchange}
          closeDrawer={() => setExchange(null)}
        />
            <div className="flex justify-end p-4">
          <button
          onClick={handleDownloadExcel}
          style={{backgroundColor:colorBackground}}
          className="relative top-[-120px] hover:bg-[#132144] text-white font-bold py-2 px-4 rounded mr-2"
        >
          Download Excel
        </button>
        </div>
      </div>
    </Skeleton>
  );
}
