import { useDeactivateBank, useGetBanks } from "@/api/hooks/admin/banks";
import { PageHeader } from "@/components/admin/page-header";
import { AddBankButton } from "@/layout/admin/banks/add-bank";
import { MapBankButton } from "@/layout/admin/banks/map-bank";
import { AppLayout } from "@/layout/common/app-layout";
import { IBank } from "@/utils/validators/interfaces";
import { ActionIcon, Button, LoadingOverlay, Menu, Table } from "@mantine/core";
import { More } from "iconsax-react";
import { ReactElement, useCallback, useMemo } from "react";
import { FaDownload } from "react-icons/fa6";

export default function Banks() {
  const { data: banks, isLoading: banksLoading } = useGetBanks();
  const { mutate, isLoading } = useDeactivateBank();

  const changeActiveStatus = useCallback(
    function (bank: IBank) {
      mutate({
        name: bank.name,
        category: bank.category,
        is_active: !bank.is_active,
        id: bank.id,
      });
    },
    [mutate]
  );

  const _rows = useMemo(
    function () {
      return banks?.data.map(function (bank, idx) {
        return (
          <tr key={bank.id}>
            <td>{idx + 1}</td>
            <td>{bank.bankName}</td>
            <td>{bank.bankCode}</td>
            <td>
              {bank.is_active ? (
                <span className="text-accent font-semibold">Active</span>
              ) : (
                <span className="text-gray-90">Inactive</span>
              )}
            </td>
            <td>
              <Menu width={150} position="right">
                <Menu.Target>
                  <ActionIcon className="">
                    <More className="rotate-90" />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    disabled={bank.is_active}
                    onClick={() => changeActiveStatus(bank)}
                  >
                    Activate
                  </Menu.Item>
                  <Menu.Item
                    disabled={!bank.is_active}
                    onClick={() => changeActiveStatus(bank)}
                  >
                    De-activate
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          </tr>
        );
      });
    },
    [banks?.data, changeActiveStatus]
  );

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Bank management"
        subheader="Add, map and de-activate banks"
        meta={
          <>
            <MapBankButton />
            <AddBankButton />
          </>
        }
      />

      <section>
        <h3 className="font-secondary font-semibold">Banks</h3>
        <Table
          verticalSpacing="xs"
          withBorder
          className="min-h-[20vh] max-h-[50vh] overflow-y-auto relative"
        >
          <LoadingOverlay visible={banksLoading || isLoading} />
          <thead>
            <tr className="font-primary font-light">
            <th>Bank name</th>
              <th>Bank code</th>
              <th>Category</th>
              <th>Status</th> 
              <th>Action</th> 
              <th><FaDownload /></th>
            </tr>
          </thead>
          <tbody>{_rows}</tbody>
        </Table>
      </section>
    </section>
  );
}

Banks.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
