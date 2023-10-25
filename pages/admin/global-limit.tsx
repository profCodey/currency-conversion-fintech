import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { CreateGlobalLimitButton } from "@/layout/admin/compliance/create-global-limit-button";
import { UpdateGlobalLimitButton } from "@/layout/admin/compliance/update-global-limit-button";
import { useGetCurrencies } from "@/api/hooks/currencies";
import {
  useGetGlobalLimit,
  useDeleteGlobalLimitById,
} from "@/api/hooks/admin/compliance/global-limit";
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

export default function GlobalLimit() {
  const { getCurrencyCodeFromId, isLoading: getCurrencyLoading } =
    useGetCurrencies();
  const { isLoading: globalListLoading, data: globalList } =
    useGetGlobalLimit();

  const [createRateModalOpen2, setCreateRateModalOpen2] = useState(false);
  const [createRateModalOpen, setCreateRateModalOpen] = useState(false);
  const [globalLimitId, setGlobalLimitId] = useState(0);
  const [daily, setDaily] = useState(0);
  const [quarterly, setQuarterly] = useState(0);
  const [deleteId, setDeleteId] = useState(0);

  const { mutate: deleteGlobalLimit, isLoading: deleteGlobalLimitLoading } =
    useDeleteGlobalLimitById();
  const handleEditGlobalList = (bool: boolean) => {
    setCreateRateModalOpen2(bool);
  };

  function editGlobalList(id: number, daily: number, quarterly: number) {
    handleEditGlobalList(true);
    setGlobalLimitId(id);
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
    deleteGlobalLimit(deleteId);
    setDeleteId(0);
    setCreateRateModalOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
      return globalList?.data.map((global, idx) => (
        <tr key={global.id}>
          <td>{idx + 1}</td>
          <td>{getCurrencyCodeFromId(global.currency)}</td>
          <td>{global.daily_limit}</td>
          <td>{global.quarterly_limit}</td>
          <td>{global.created_by}</td>
          <td>{convertIsoToNormalTime(global.created_on)}</td>
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
                    editGlobalList(
                      global.id,
                      global.daily_limit,
                      global.quarterly_limit
                    )
                  }
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    openDeleteModal(global.id);
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
    [globalList?.data, getCurrencyCodeFromId, deleteId]
  );

  return (
    <>
      <section className="flex flex-col gap-6 h-full relative">
        <PageHeader
          header="Global Limit"
          subheader="View and set global limit"
          meta={<CreateGlobalLimitButton />}
        />
        {createRateModalOpen2 && (
          <UpdateGlobalLimitButton
            handleEditGlobalList={handleEditGlobalList}
            globalLimitId={globalLimitId}
            daily={daily}
            quarterly={quarterly}
          />
        )}
        <Modal
          title="Delete Global Limit"
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
                Are you sure you want to delete this global limit?
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
                  loading={deleteGlobalLimitLoading}
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
            <LoadingOverlay visible={globalListLoading} />
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

GlobalLimit.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
