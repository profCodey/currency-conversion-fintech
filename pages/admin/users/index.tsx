import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Table,
  TextInput,
  clsx,
} from "@mantine/core";
import { ReactElement, useMemo } from "react";
import SearchIcon from "@/public/search.svg";
import { useUsersList } from "@/api/hooks/admin/users";
import Link from "next/link";

export default function Users() {
  const { data: users, isLoading } = useUsersList();

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

      <Table withBorder verticalSpacing="sm" className="mt-5">
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
      </Table>
    </section>
  );
}

Users.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
