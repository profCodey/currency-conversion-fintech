import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Table,
  TextInput,
  clsx,
} from "@mantine/core";
import SearchIcon from "@/public/search.svg";
import { useState } from "react";
import { Fundings } from "./transactions";
import { UserManualFundingHistory } from "./user/manual-fundings";
import { ManualFundingHistory } from "../transactions/manual-funding";

const transactions: {
  sN: number;
  user: string;
  type: string;
  amount: string;
  status: "Approved" | "Declined" | "Pending";
}[] = [
  {
    sN: 1,
    user: "Emily Parker",
    type: "Transfer",
    amount: "₦654,321",
    status: "Approved",
  },
  {
    sN: 2,
    user: "James Collins",
    type: "Withdrawal",
    amount: "₦123,456",
    status: "Declined",
  },
  {
    sN: 3,
    user: "Sophia Anderson",
    type: "Exchange",
    amount: "₦789,012",
    status: "Pending",
  },
  {
    sN: 4,
    user: "Daniel Turner",
    type: "Transfer",
    amount: "₦234,567",
    status: "Approved",
  },
  {
    sN: 5,
    user: "Olivia Mitchell",
    type: "Withdrawal",
    amount: "₦876,543",
    status: "Pending",
  },
  {
    sN: 6,
    user: "Henry Thompson",
    type: "Transfer",
    amount: "₦456,789",
    status: "Declined",
  },
  {
    sN: 7,
    user: "Sophie Davis",
    type: "Exchange",
    amount: "₦321,654",
    status: "Approved",
  },
  {
    sN: 8,
    user: "Michael Wilson",
    type: "Withdrawal",
    amount: "₦987,654",
    status: "Pending",
  },
  {
    sN: 9,
    user: "Emma Clark",
    type: "Transfer",
    amount: "₦567,890",
    status: "Approved",
  },
  {
    sN: 10,
    user: "Jacob Murphy",
    type: "Withdrawal",
    amount: "₦432,109",
    status: "Declined",
  },
];

export function TransactionsList() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rows = transactions.map((transaction) => (
    <tr key={transaction.sN}>
      <td>{transaction.sN}</td>
      <td>{transaction.user}</td>
      <td>{transaction.type}</td>
      <td>{transaction.amount}</td>
      <td>
        <span
          className={clsx(
            transaction.status === "Approved" && "text-[#13A500]",
            transaction.status === "Declined" && "text-[#BA0000]",
            transaction.status === "Pending" && "text-gray-70"
          )}
        >
          {transaction.status}
        </span>
      </td>
      <td>
        <Button
          variant="white"
          className="text-accent"
          onClick={() => setDrawerOpen(true)}
        >
          Open
        </Button>
      </td>
    </tr>
  ));
  return (
    <section>
      <div className="flex justify-between">
        <form>
          <Group>
            <TextInput placeholder="Search user" size="lg" radius={100} />
            <ActionIcon
              radius={100}
              variant="filled"
              className="bg-accent hover:bg-accent"
              size="xl"
            >
              <SearchIcon />
            </ActionIcon>
          </Group>
        </form>
      </div>
      {/* <Fundings /> */}
      <ManualFundingHistory />
      {/* <Table withBorder verticalSpacing="sm" className="mt-5">
        <thead>
          <tr className="shadow">
            <th>S/N</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      <Drawer
        opened={drawerOpen}
        title="View Transaction"
        onClose={() => setDrawerOpen(false)}
        position="right"
        // size="sm"
      ></Drawer> */}
    </section>
  );
}
