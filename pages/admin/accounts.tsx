import {
  useDeactivateAccount,
  useDeleteAccount,
  useGetPaycelerBankDetails,
} from "@/api/hooks/banks";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { PageHeader } from "@/components/admin/page-header";
import { AddAccountButton } from "@/layout/admin/accounts";
import { AppLayout } from "@/layout/common/app-layout";
import { IPaycelerAccount } from "@/utils/validators/interfaces";
import { ActionIcon, LoadingOverlay, Menu, Table } from "@mantine/core";
import { More } from "iconsax-react";
import { ReactElement, useCallback, useMemo } from "react";

export default function Banks() {
  const { data: accounts, isLoading: accountsLoading } =
    useGetPaycelerBankDetails();
  const { mutate, isLoading } = useDeactivateAccount();
  const { mutate: deleteAccount, isLoading: deleteAccountLoading } =
    useDeleteAccount();
  const { getCurrencyNameFromId, isLoading: currencyLoading } =
    useCurrencyOptions();

  const changeActiveStatus = useCallback(
    function (account: IPaycelerAccount) {
      mutate({
        ...account,
        is_active: !account.is_active,
        id: account.id,
      });
    },
    [mutate]
  );

  const _rows = useMemo(
    function () {
      return accounts?.data.map(function (account, idx) {
        return (
          <tr key={account.id}>
            <td>{idx + 1}</td>
            <td>{account.bank_name}</td>
            <td>{account.account_name}</td>
            <td>{getCurrencyNameFromId(account.currency)}</td>
            <td>{account.category}</td>
            <td>
              {account.is_active ? (
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
                    disabled={account.is_active}
                    onClick={() => changeActiveStatus(account)}
                  >
                    Activate
                  </Menu.Item>
                  <Menu.Item
                    disabled={!account.is_active}
                    onClick={() => changeActiveStatus(account)}
                  >
                    De-activate
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => deleteAccount(account.id)}
                    color="red"
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          </tr>
        );
      });
    },
    [accounts?.data, changeActiveStatus, deleteAccount, getCurrencyNameFromId]
  );

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Accounts"
        subheader="Add Local and FX Accounts for manual payments"
        meta={<AddAccountButton />}
      />

      <section>
        <h3 className="font-secondary font-semibold">Banks</h3>
        <Table
          verticalSpacing="xs"
          withBorder
          className="min-h-[20vh] max-h-[50vh] overflow-y-auto relative"
        >
          <LoadingOverlay
            visible={
              accountsLoading ||
              isLoading ||
              deleteAccountLoading ||
              currencyLoading
            }
          />
          <thead>
            <tr className="font-primary font-light">
              <th>S/N</th>
              <th>Bank name</th>
              <th>Account name</th>
              <th>Currency</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
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
