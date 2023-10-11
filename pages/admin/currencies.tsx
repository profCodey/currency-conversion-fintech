import { useGetCurrencies } from "@/api/hooks/currencies";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { PageHeader } from "@/components/admin/page-header";
import { CreateCurrencyButton } from "@/layout/admin/currencies/create-currency-button";
import { EditCurrencyButton } from "@/layout/admin/currencies/edit-currency-button";
import { AppLayout } from "@/layout/common/app-layout";
import { ICurrency } from "@/utils/validators/interfaces";
import { ActionIcon, LoadingOverlay, Menu, Table } from "@mantine/core";
import { More } from "iconsax-react";
import { ReactElement, useMemo, useState } from "react";

export default function Currencies() {
  const { getCurrencyNameFromId, isLoading } = useCurrencyOptions();
  const { data, isLoading: ratesLoading } = useGetCurrencies();
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | null>(null);
  
  const _rows = useMemo(
    function () {
      return data?.data.map((value, idx) => (
        <tr key={value.id}>
          <td>{idx + 1}</td>
          <td>{value.code}</td>
          <td>{value.name}</td>
          <td>
            <Menu width={150} position="right">
              <Menu.Target>
                <ActionIcon className="">
                  <More className="rotate-90" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => {
                 setSelectedCurrency(value);
                }}>Edit</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </td>
        </tr>
      ));
    },
    [data?.data]
  );

  return (
    <section className="flex flex-col gap-6 h-full relative">
      <PageHeader
        header="Currencies"
        subheader="View and set currencies"
        meta={<CreateCurrencyButton />}
      />

      <section className="">
        <h3 className="font-semibold mt-2">Currencies:</h3>

        <Table verticalSpacing="md" withBorder>
          <LoadingOverlay visible={isLoading || ratesLoading} />
          <thead>
            <tr>
              <th>S/N</th>
              <th>Code</th>
              <th>Currency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{_rows}</tbody>
        </Table>
        {!selectedCurrency ? "" : <EditCurrencyButton currency={selectedCurrency} setCurrency={setSelectedCurrency}/>};
      </section>
    </section>
  );
}

Currencies.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
