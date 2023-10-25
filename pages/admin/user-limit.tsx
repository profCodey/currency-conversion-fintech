import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { CreateUserLimitButton } from "@/layout/admin/compliance/create-user-limit-button";
import { UpdateUserLimitButton } from "@/layout/admin/compliance/update-user-limit-button";
import { useGetCurrencies } from "@/api/hooks/currencies";
import {
  useGetUserLimit,
  useDeleteUserLimitById,
} from "@/api/hooks/admin/compliance/user-limit";
import { AppLayout } from "@/layout/common/app-layout";
import {
  ActionIcon,
  LoadingOverlay,
  Menu,
  Table,
  Stack,
  Group,
  Button,
  Modal,
} from "@mantine/core";
import { More } from "iconsax-react";
import { ReactElement, useMemo } from "react";

export default function UserLimit() {
  const { getCurrencyCodeFromId, isLoading: getCurrencyLoading } =
    useGetCurrencies();
  const { isLoading: userListLoading, data: userList } = useGetUserLimit();

  const [createRateModalOpen2, setCreateRateModalOpen2] = useState(false);
  const [createRateModalOpen, setCreateRateModalOpen] = useState(false);
  const [userLimitId, setUserLimitId] = useState(0);
  const [daily, setDaily] = useState(0);
  const [quarterly, setQuarterly] = useState(0);
  const [deleteId, setDeleteId] = useState(0);

  const { mutate: deleteUserLimit, isLoading: deleteUserLimitLoading } =
    useDeleteUserLimitById();
  const handleEditUserList = (bool: boolean) => {
    setCreateRateModalOpen2(bool);
  };

  function edituserList(id: number, daily: number, quarterly: number) {
    handleEditUserList(true);
    setUserLimitId(id);
    setDaily(daily);
    setQuarterly(quarterly);
    setCreateRateModalOpen2(true);
  }

  function openDeleteModal(id: number) {
    setCreateRateModalOpen(true);
    setDeleteId(id);
  }

  function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deleteUserLimit(deleteId);
    setDeleteId(0);
    setCreateRateModalOpen(false);
  }

  function convertIsoToNormalTime(isoTimestamp: string | number | Date) {
    const date = new Date(isoTimestamp);

    const options = {
      year: "numeric" as const,
      month: "numeric" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    };

    return date.toLocaleDateString("en-US", options);
  }

  const _rows = useMemo(
    function () {
      return userList?.data.map((user, idx) => (
        <tr key={user.id}>
          <td>{idx + 1}</td>
          <td>{getCurrencyCodeFromId(user.currency)}</td>
          <td>{user.daily_limit}</td>
          <td>{user.quarterly_limit}</td>
          <td>{user.created_by}</td>
          <td>{convertIsoToNormalTime(user.created_on)}</td>
          <td>
            <Menu width={150} position="right">
              <Menu.Target>
                <ActionIcon className="">
                  <More className="rotate-90" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() =>
                    edituserList(
                      user.id,
                      user.daily_limit,
                      user.quarterly_limit
                    )
                  }
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    openDeleteModal(user.id);
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </td>
        </tr>
      ));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userList?.data, getCurrencyCodeFromId, deleteId]
  );

  return (
    <>
      <section className="flex flex-col gap-6 h-full relative">
        <PageHeader
          header="User Limit"
          subheader="View and set user limit"
          meta={<CreateUserLimitButton />}
        />
        {createRateModalOpen2 && (
          <UpdateUserLimitButton
            handleEditUserList={handleEditUserList}
            userLimitId={userLimitId}
            daily={daily}
            quarterly={quarterly}
          />
        )}
        <Modal
          title="Delete User Limit"
          opened={createRateModalOpen}
          onClose={() => setCreateRateModalOpen(false)}
          size="md"
          centered
        >
          <form
            onSubmit={(e) => {
              handleDelete(e);
            }}
            className="relative"
          >
            <Stack>
              <p className=" text-center text-lg py-8 px-12">
                Are you sure you want to delete this user limit?
              </p>
              <Group grow>
                <Button
                  className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                  size="md"
                  type="button"
                  onClick={() => setCreateRateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary-100 hover:bg-primary-100"
                  size="md"
                  type="submit"
                  loading={deleteUserLimitLoading}
                  loaderPosition="right"
                >
                  Delete
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        <section className="">
          <Table verticalSpacing="md" withBorder>
            <LoadingOverlay visible={userListLoading} />
            <thead>
              <tr>
                <th>S/N</th>
                <th>Currency Code</th>
                <th>Daily Limit</th>
                <th>Quarterly Limit</th>
                <th>Created By</th>
                <th>Updated On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{_rows}</tbody>
          </Table>
        </section>
      </section>
    </>
  );
}

UserLimit.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
