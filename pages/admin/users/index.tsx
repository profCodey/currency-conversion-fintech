import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import { Button, clsx } from "@mantine/core";
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

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader header="Users" subheader="View and manage user details" />
      <Table columns={columns} data={users?.data || []} />
    </section>
  );
}

Users.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
