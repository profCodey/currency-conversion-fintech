import { useGetFxPayouts } from "@/api/hooks/fx";
import {
  Button,
  Skeleton,
  Table,
} from "@mantine/core";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FxPayoutDetail } from "./fx-payout-detail";
import { IFxPayout } from "@/utils/validators/interfaces";

export function FxPayoutHistory() {
  const [payout, setPayout] = useState<IFxPayout | null>(null);
  const { data: fxPayouts, isLoading } = useGetFxPayouts();

  const rows = useMemo(
    function () {
      return fxPayouts?.data?.map(function (payout) {
        return (
          <tr key={payout.id}>
            <td>{payout.account_name}</td>
            <td>{payout.amount}</td>
            <td>{dayjs(payout.created_on).format("MMM D, YYYY h:mm A")}</td>
            <td>{payout.created_by_name}</td>
            <td>{payout.bank_name}</td>
            <td>{payout.narration}</td>
            <td>{payout.status}</td>
            <td>
              <Button
                size="xs"
                variant="white"
                onClick={() => setPayout(payout)}
              >
                Details
              </Button>
            </td>
          </tr>
        );
      });
    },
    [fxPayouts?.data]
  );

  return (
    <Skeleton visible={isLoading} className="flex-grow">
      <div className="flex-grow overflow-y-auto relative flex flex-col h-full">
        <Table verticalSpacing="md" withBorder>
          <thead>
            <tr className="font-primary font-light">
              <th>Account name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Created by</th>
              <th>Bank name</th>
              <th>Narration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <FxPayoutDetail
          open={!!payout}
          payout={payout}
          closeDrawer={() => setPayout(null)}
        />
      </div>
    </Skeleton>
  );
}
