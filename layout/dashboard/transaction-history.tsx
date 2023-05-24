import Image from "next/image";
import EmptyTransactionListVector from "@/public/empty_transaction.svg";
import { Table } from "@mantine/core";

const transactions = [
  {
    id: "1",
    transactionType: "Payment",
    status: "processing",
    recipient: "Bank A",
    date: "07-01-2020",
    amountSent: "$5,000",
    amountReceived: "$4,800",
  },
  {
    id: "2",
    transactionType: "Transfer",
    status: "cancelled",
    recipient: "Bank B",
    date: "12-05-2020",
    amountSent: "$2,500",
    amountReceived: "$2,400",
  },
  {
    id: "3",
    transactionType: "Withdrawal",
    status: "completed",
    recipient: "Bank C",
    date: "03-22-2021",
    amountSent: "$1,200",
    amountReceived: "$1,150",
  },
  {
    id: "4",
    transactionType: "Payment",
    status: "completed",
    recipient: "Bank D",
    date: "09-14-2022",
    amountSent: "$3,800",
    amountReceived: "$3,650",
  },
  {
    id: "5",
    transactionType: "Transfer",
    status: "processing",
    recipient: "Bank E",
    date: "06-30-2023",
    amountSent: "$7,500",
    amountReceived: "$7,200",
  },
  {
    id: "6",
    transactionType: "Payment",
    status: "cancelled",
    recipient: "Bank F",
    date: "11-08-2023",
    amountSent: "$4,300",
    amountReceived: "$4,100",
  },
];

export function TransactionHistory() {
  let emptyTransactionHistory = false;

  const rows = transactions.map((transaction) => (
    <tr key={transaction.id}>
      <td>{transaction.transactionType}</td>
      <td>{transaction.recipient}</td>
      <td>{transaction.date}</td>
      <td>{transaction.amountSent}</td>
      <td>{transaction.amountReceived}</td>
    </tr>
  ));

  if (emptyTransactionHistory) return <EmptyTransactionHistory />;
  return (
    <div className="flex-grow flex flex-col gap-2">
      <div className="bg-gray-30 rounded-lg border p-5 flex justify-between">
        <span className="text-primary-100 font-semibold">
          Recent Transactions
        </span>
      </div>
      <div className="flex-grow border overflow-y-auto">
        <Table verticalSpacing="md">
          <thead>
            <tr className="font-primary font-light">
              <th>Last transaction</th>
              <th>Recipient</th>
              <th>Date</th>
              <th>Sent</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
}

function EmptyTransactionHistory() {
  return (
    <div className="flex-grow bg-gray-30 rounded-lg border flex flex-col items-center justify-center gap-8 p-8">
      <span className="text-primary-100 text-xl font-secondary">
        Your recent transaction will be shown here
      </span>
      <Image src={EmptyTransactionListVector} alt="" />
    </div>
  );
}
