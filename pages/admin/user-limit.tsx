import { useGetRates } from "@/api/hooks/admin/rates";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { PageHeader } from "@/components/admin/page-header";
import { CreateUserLimitButton } from "@/layout/admin/compliance/create-user-limit-button";
import { AppLayout } from "@/layout/common/app-layout";
import { ActionIcon, LoadingOverlay, Menu, Table } from "@mantine/core";
import dayjs from "dayjs";
import { More } from "iconsax-react";
import { ReactElement, useMemo } from "react";

export default function UserLimit() {
  const { getCurrencyNameFromId, isLoading } = useCurrencyOptions();
  const { data, isLoading: ratesLoading } = useGetRates();

  const _rows = useMemo(
    function () {
      return data?.data.map((rate, idx) => (
        <tr key={rate.id}>
          <td>{idx + 1}</td>
          <td>{rate.rate}</td>
          <td>{getCurrencyNameFromId(rate.source_currency)}</td>
          <td>{getCurrencyNameFromId(rate.destination_currency)}</td>
          <td>
            {rate.is_active ? (
              <span className="text-accent font-semibold">Active</span>
            ) : (
              <span className="text-gray-90">Inactive</span>
            )}
          </td>
          <td>{dayjs(rate.updated_on).format("MMM D, YYYY h:mm A")}</td>
          <td>
            <Menu width={150} position="right">
              <Menu.Target>
                <ActionIcon className="">
                  <More className="rotate-90" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => {}}>Edit</Menu.Item>
                <Menu.Item disabled={rate.is_active} onClick={() => {}}>
                  Activate
                </Menu.Item>
                <Menu.Item disabled={!rate.is_active} onClick={() => {}}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </td>
        </tr>
      ));
    },
    [data?.data, getCurrencyNameFromId]
  );

  return (
    <section className="flex flex-col gap-6 h-full relative">
      <PageHeader
        header="User Limit"
        subheader="View and set user limit"
        meta={<CreateUserLimitButton />}
      />

      <section className="">

        <Table verticalSpacing="md" withBorder>
          <LoadingOverlay visible={isLoading || ratesLoading} />
          <thead>
            <tr>
              <th>S/N</th>
              <th>Rate</th>
              <th>Source currency</th>
              <th>Destination currency</th>
              <th>Status</th>
              <th>Last updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{_rows}</tbody>
        </Table>
      </section>
    </section>
  );
}

UserLimit.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
