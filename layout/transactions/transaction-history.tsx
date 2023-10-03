import { useState } from "react";
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
  const [transactionModalState, setTransactionModalState] = useState(false);
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

  // function handleShowModal(payoutId: string) {
  //   setTransactionModalState((prevState) => ({
  //     ...prevState,
  //     [payoutId]: true,
  //   }));
  // }

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
  const transactionModalContent = Object.entries(transactionModalState).map(([payoutId, showModal]) => (
    showModal && (
      <TransactionModal 
        key={payoutId} 
        payout={payoutHistory?.data.result?.find(payout => payout.payoutId === payoutId)}
        // onClose={() => setTransactionModalState((prevState) => ({ ...prevState, [payoutId]: false }))}
      />
    )
  ));

  const _rows = useMemo(
    function () {
      return payoutHistory?.data.result
        ?.map(function (payout) {
          return (
            <>
          {/* { transactionModalState &&  (<TransactionModal 
            // data={sampleData} 
            payout={payout} 
            // onClose={() => setSelectedPayout(null)}
            />) } */}
            <tr key={payout.payoutId} className="text-primary-100 font-medium">
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
              <td>{payout.accountName}</td>
              <td>{dayjs(payout.createdOn).format("MMM D, YYYY h:mm A")}</td>
              <td>{currencyFormatter(Number(payout.amount))}</td>
              <td>{payout.charges}</td>
              <td onClick={() => {setTransactionModalState(true)}}>
            <FaDownload />
          </td>
            </tr>
            </>
          );
      
        })
        .reverse();
    },
    [payoutHistory?.data.result]
  );
  // {console.log('tranasction', transactionModalState)}
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



// import React, { useState } from "react";
// import EmptyTransactionListVector from "@/public/empty_transaction.svg";
// import { Group, LoadingOverlay, Skeleton, Stack, Table } from "@mantine/core";
// import { useDefaultGateway } from "@/api/hooks/gateways";
// import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
// import dayjs from "dayjs";
// import { DatePickerInput } from "@mantine/dates";
// import { currencyFormatter } from "@/utils/currency";
// import {
//   IPayoutHistory,
//   PayoutRecordStatuses,
// } from "@/utils/validators/interfaces";
// import { AxiosResponse } from "axios";
// import { useRole } from "@/api/hooks/user";
// import { USER_CATEGORIES } from "@/utils/constants";

// import TransactionFailedIcon from "@/public/transaction-cancelled.svg";
// import TransactionCompletedIcon from "@/public/transaction-completed.svg";
// import TransactionProcessingIcon from "@/public/transaction-processing.svg";
// import { FaDownload } from "react-icons/fa6";
// import TransactionModal from "./transactionModal";

// export function TransactionHistory({
//   payoutHistory,
//   payoutHistoryFetching,
//   dateRange,
//   setDateRange,
//   meta,
// }: {
//   payoutHistory: AxiosResponse<IPayoutHistory> | undefined;
//   payoutHistoryFetching: boolean;
//   dateRange: [Date | null, Date | null];
//   setDateRange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
//   meta?: ReactNode;
// }) {
//   const { defaultGateway, isLoading: selectedGatewaysLoading } =
//     useDefaultGateway();
//   const { role } = useRole();
//   const [transactionModalState, setTransactionModalState] = useState<Record<string, boolean>>({});
//   const isAdmin = role === USER_CATEGORIES.ADMIN;
//   let emptyTransactionHistory =
//     payoutHistory?.data &&
//     (payoutHistory?.data.result === null ||
//       payoutHistory?.data.result?.length < 1);

//   function getTransactionIcon(status: PayoutRecordStatuses) {
//     switch (status) {
//       case "FailedDuringSend":
//       case "Failed":
//       case "UnResolvable":
//         return <TransactionFailedIcon className="scale-75" />;
//       case "Paid":
//         return <TransactionCompletedIcon className="scale-75" />;
//       case "SentToGateway":
//       case "Pending":
//         return <TransactionProcessingIcon />;
//       default:
//         return null;
//     }
//   }

//   function handleShowModal(payoutId: string) {
//     setTransactionModalState((prevState) => ({
//       ...prevState,
//       [payoutId]: true,
//     }));
//   }

//   function getTransactionStatus(status: PayoutRecordStatuses) {
//     switch (status) {
//       case "FailedDuringSend":
//       case "Failed":
//         return "Failed";
//       case "UnResolvable":
//         return "Unresolved";
//       case "Paid":
//         return "Completed";
//       case "SentToGateway":
//         return "Processing";
//       default:
//         return status;
//     }
//   }

//   const _rows = useMemo(
//     function () {
//       return payoutHistory?.data.result
//         ?.map(function (payout) {
//           return (
//             <React.Fragment key={payout.payoutId}>
//               {transactionModalState[payout.payoutId] && (
//                 <TransactionModal 
//                   // data={sampleData} 
//                   payout={payout} 
//                   // onClose={() => setSelectedPayout(null)}
//                 />
//               )}
//               <tr className="text-primary-100 font-medium">
//                 <td className="text-xs sm:text-base">
//                   <Group spacing="xs">
//                     <span className="hidden sm:block">
//                       {getTransactionIcon(payout.status)}
//                     </span>
//                     <Stack spacing={0}>
//                       <span className="font-medium text-primary-100">
//                         {payout.narration}
//                       </span>
//                       <span className="text-primary-70">
//                         {getTransactionStatus(payout.status)}
//                       </span>
//                     </Stack>
//                   </Group>
//                 </td>
//                 <td>{payout.accountName}</td>
//                 <td>{dayjs(payout.createdOn).format("MMM D, YYYY h:mm A")}</td>
//                 <td>{currencyFormatter(Number(payout.amount))}</td>
//                 <td>{payout.charges}</td>
//                 <td onClick={() => handleShowModal(payout.payoutId)}>
//                   <FaDownload />
//                 </td>
//               </tr>
//             </React.Fragment>
//           );
//         })
//         .reverse();
//     },
//     [payoutHistory?.data.result, transactionModalState]
//   );

//   // ... (rest of the code)
// }

