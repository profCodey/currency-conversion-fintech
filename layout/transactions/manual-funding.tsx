
import { useGetManualFundings } from "@/api/hooks/banks";
import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import { currencyFormatter, getCurrency } from "@/utils/currency";
import { IManualPayment } from "@/utils/validators/interfaces";
import {
  Badge,
  Box,
  Button,
  Col,
  LoadingOverlay,
  Table as MTable,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { FundingStatuses, ManualFundingDrawer } from "./manual-funding-drawer";
import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Table from "@/components/table";
import { FaDownload } from "react-icons/fa6";
import TransactionModal from "./transactionModal";
import { jsPDF } from "jspdf";
import { CSVLink } from 'react-csv';

import * as XLSX from 'xlsx';

export const exportToCSV = (data, columns, filename) => {
  console.log(columns);
  
  const csvData = data.map(row => columns.map(column => row[column.id])).filter(Boolean);
  const headers = columns.map(column => column.header);

  console.log('csvData', csvData);
  console.log('headers', headers);

  return (
    <CSVLink data={[headers, ...csvData]} filename={filename}>
      Export to CSV
    </CSVLink>
  );
};



export const exportToExcel = (data, columns, filename) => {
  console.log(columns);
  
  const ws = XLSX.utils.json_to_sheet(data, { header: columns.map(column => column.header) });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
  XLSX.writeFile(wb, filename);
};


// TODO: Use one code instance of manual funding history table

export function ManualFundingHistory() {
  const [fundingData, setFundingData] = useState<IManualPayment | null>(null);
  const { data: manualFundings, isLoading: manualFundingsLoading } =
    useGetManualFundings();
    console.log(useGetManualFundings().data?.data);
    const [modalVisible, setModalVisible] = useState(false); 
    
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


  const handleDownloadCSV = () => {
    exportToCSV(manualFundings?.data || [], columns, 'manual_fundings.csv');
  };
  
  const handleDownloadExcel = () => {
    exportToExcel(manualFundings?.data || [], columns, 'manual_fundings.xlsx');
  };
  

  const handleDownload = (rowData) => {
    // Open the TransactionModal and pass the rowData
    // console.log(rowData);
    // setFundingData(rowData);
    // setModalVisible(true);  // Set modalVisible to true

    const pdf = new jsPDF();
  
    // Format the data for PDF content
    const pdfContent = `
    Manual Funding Details

      Amount: ${rowData.amount}
      Category: ${rowData.category}
      Created On: ${rowData.created_on}
      Currency: ${rowData.currency}
      ID: ${rowData.id}
      Sender Name: ${rowData.sender_name}
      Sender Narration: ${rowData.sender_narration}
      Status: ${rowData.status}
      Target Account: ${rowData.target_account}
      Target Account Label: ${rowData.target_account_label}
      Updated On: ${rowData.updated_on}
      User: ${rowData.user}
    `;
    
    // Add the content to the PDF
    pdf.text(pdfContent, 10, 10);
    
    // Download the PDF
    pdf.save("transaction_receipt.pdf");
  };


  const ColumnHelper = createColumnHelper<IManualPayment>();

  const columns = useMemo(function () {
    const genericColumns = [
      ColumnHelper.accessor("status", {
        header: "Status",
        id: "status",
        cell: (props) => {
          const status = props.cell.getValue();
          return (
            <div className="flex gap-1 items-center">
              {/* <span className="hidden sm:visible">
                {getTransactionIcon(props.cell.getValue())}
              </span> */}
              <span>
                <Badge
                  variant="dot"
                  color={
                    status === "approved"
                      ? "green"
                      : status === "cancelled" || status === "rejected"
                      ? "red"
                      : "grape"
                  }
                >
                  {props.cell.getValue()}
                </Badge>
              </span>
            </div>
          );
        },
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
      ColumnHelper.accessor("id", {
        header: "Download",
        id: "download",
        cell: (props) => (
          <Button
            variant="white"
            className="px-0 text-red-500 my-auto"
            onClick={() => handleDownload(props.row.original)}
          >
            <FaDownload />
          </Button>
        ),
      }),

      
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
    <>
          <div className="">
        <button
          onClick={handleDownloadExcel}
          className="bg-[#132144] hover:bg-[#132144] text-white font-bold py-2 px-4 rounded mr-2"
        >
          Download Excel
        </button>
        <button
          onClick={handleDownloadCSV}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Download CSV
        </button>
      </div>
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

       {/* Render the TransactionModal component with props */}
       {/* {modalVisible && <TransactionModal payout={fundingData} onClose={() => setModalVisible(false)} />} */}
    </Box>
    </>
  );
}
