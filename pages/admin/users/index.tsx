import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Table as MTable,
  TextInput,
  clsx,
} from "@mantine/core";
import { ReactElement, useMemo } from "react";
import { useUsersList } from "@/api/hooks/admin/users";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/utils/validators/interfaces";
import Table from "@/components/table";
export default function Users() {
  const { data: users, isLoading } = useUsersList();
  const ColumnHelper = createColumnHelper<User>();

  const columns = useMemo(
    function () {
      return [
        ColumnHelper.accessor("id", {
          header: "S/N",
          cell: (props) => props.row.index + 1,
        }),
        ColumnHelper.accessor("id", {
          header: "Name",
          cell: (props) =>
            `${props.row.original.first_name} ${props.row.original.last_name}`,
        }),
        ColumnHelper.accessor("email", {
          header: "Email",
        }),
        ColumnHelper.accessor("phone_number", {
          header: "Phone number",
        }),
        ColumnHelper.accessor("is_approved", {
          header: "Status",
          cell: (props) => (
            <span
              className={clsx(
                props.cell.getValue() ? "text-[#13A500]" : "text-gray-70"
              )}
            >
              {props.cell.getValue() ? "Approved" : "Unapproved"}
            </span>
          ),
        }),
        ColumnHelper.accessor("id", {
          header: "Action",
          cell: (props) => (
            <Link href={`/admin/users/${props.cell.getValue()}`}>
              <Button variant="white" className="px-0 text-accent">
                Open
              </Button>
            </Link>
          ),
        }),
      ];
    },
    [ColumnHelper]
  );

  const rows = useMemo(
    function () {
      return users?.data.map((user, idx) => (
        <tr key={user.id}>
          <td>{idx + 1}</td>
          <td>
            {user.first_name} {user.last_name}
          </td>
          <td>{user.email}</td>
          <td>{user.phone_number}</td>
          <td>
            <span
              className={clsx(
                user.is_approved ? "text-[#13A500]" : "text-gray-70"
              )}
            >
              {user.is_approved ? "Approved" : "Unapproved"}
            </span>
          </td>
          <td>
            <Link href={`/admin/users/${user.id}`}>
              <Button variant="white" className="px-0 text-accent">
                Open
              </Button>
            </Link>
          </td>
        </tr>
      ));
    },
    [users?.data]
  );

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader header="Users" subheader="View and manage user details" />
      <Table columns={columns} data={users?.data || []} />
      {/* <Table withBorder verticalSpacing="sm" className="mt-5 relative">
        <LoadingOverlay visible={isLoading} />
        <thead>
          <tr className="shadow">
            <th>S/N</th>
            <th>Name</th>
            <th>E-mail</th>
            <th>Phone number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table> */}
    </section>
  );
}

Users.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
