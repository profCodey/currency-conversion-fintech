import { useGetManualFundings } from "@/api/hooks/banks";
import { currencyFormatter } from "@/utils/currency";
import { Box, LoadingOverlay, Table } from "@mantine/core";
import { useMemo } from "react";

export function ManualFundingHistory() {
  const { data: manualFundings, isLoading: manualFundingsLoading } =
    useGetManualFundings();

  const rows = useMemo(
    function () {
      return manualFundings?.data.map(function (funding) {
        return (
          <tr key={funding.id}>
            <td>{funding.status}</td>
            <td>{funding.account_name}</td>
            <td>{currencyFormatter(Number(funding.amount))}</td>
            <td>{funding.reference}</td>
            <td>{funding.gateway_name}</td>
          </tr>
        );
      });
    },
    [manualFundings?.data]
  );
  return (
    <Box className="flex-grow border h-full relative">
      <LoadingOverlay visible={manualFundingsLoading} />
      <Table verticalSpacing="md">
        <thead>
          <tr>
            <th>Status</th>
            <th>Account Name</th>
            <th>Amount (₦)</th>
            <th>Reference</th>
            <th>Gateway name</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  );
}
