import { useGetFxPayouts } from "@/api/hooks/fx";
import { Button, Skeleton, Table } from "@mantine/core";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FxPayoutDetail } from "./fx-payout-detail";
import { IFxPayout } from "@/utils/validators/interfaces";

import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
import TransactionCompletedIcon from "@/public/transaction-completed.svg";
import TransactionProcessingIcon from "@/public/transaction-processing.svg";
import { FundingStatuses } from "./manual-funding-drawer";
import { FaDownload } from "react-icons/fa6";
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

export function FxPayoutHistory() {
  const [payout, setPayout] = useState<IFxPayout | null>(null);
  const { data: fxPayouts, isLoading } = useGetFxPayouts();

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



  const handleDownloadCSV = () => {
    // Check if fxPayouts and fxPayouts.data are defined
    if (!fxPayouts || !fxPayouts.data) {
      console.warn('No data available for CSV export');
      return null;
    }
  
    const csvData = fxPayouts.data.map(payout => ({
      Status: payout.status,
      'Account Name': payout.account_name,
      Amount: payout.amount,
      Date: dayjs(payout.created_on).format("MMM D, YYYY h:mm A"),
      'Created by': payout.created_by_name,
      'Bank Name': payout.bank_name,
      Narration: payout.narration
    }));
  
    // Check if csvData is not empty
    if (csvData.length === 0) {
      console.warn('No data available for CSV export');
      return null;
    }
    
  
    const headers = Object.keys(csvData[0]);
  
    return (
      <CSVLink data={[headers, ...csvData]} filename="fx_payouts.csv">
        Export to CSV
      </CSVLink>
    );
  };
  

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(fxPayouts?.data?.map(payout => ({
      Status: payout.status,
      'Account Name': payout.account_name,
      Amount: payout.amount,
      Date: dayjs(payout.created_on).format("MMM D, YYYY h:mm A"),
      'Created by': payout.created_by_name,
      'Bank Name': payout.bank_name,
      Narration: payout.narration
    })) || []);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, 'fx_payouts.xlsx');
  };



  const rows = useMemo(
    function () {
      return fxPayouts?.data?.map(function (payout) {
        return (
          <tr key={payout.id}>
            <td className="flex gap-1 items-center">
              {getTransactionIcon(payout.status)} <span>{payout.status}</span>
            </td>
            <td>{payout.account_name}</td>
            <td>{payout.amount}</td>
            <td>{dayjs(payout.created_on).format("MMM D, YYYY h:mm A")}</td>
            <td>{payout.created_by_name}</td>
            <td>{payout.bank_name}</td>
            <td>{payout.narration}</td>
            <td><FaDownload /></td>


            <td>
              <Button
                size="xs"
                variant="white"
                onClick={() => setPayout(payout)}
              >
                Details
              </Button>
            </td>
          </tr>
        );
      });
    },
    [fxPayouts?.data]
  );

  return (
    <Skeleton visible={isLoading} className="flex-grow">
      <div className="flex-grow overflow-y-auto relative flex flex-col h-full">
      <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadExcel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
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
        
        <Table verticalSpacing="md" withBorder>
          <thead>
            <tr className="font-primary font-light">
              <th>Status</th>
              <th>Account name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Created by</th>
              <th>Bank name</th>
              <th>Narration</th>
              <th>View Details</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <FxPayoutDetail
          open={!!payout}
          payout={payout}
          closeDrawer={() => setPayout(null)}
        />
      </div>
    </Skeleton>
  );
}
