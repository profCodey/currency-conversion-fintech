import { useApproveRejectFunding } from "@/api/hooks/admin/funding";
import { currencyFormatter, getCurrency } from "@/utils/currency";
import { IManualPayment } from "@/utils/validators/interfaces";
import {
  Box,
  Button,
  Drawer,
  Group,
  Stack,
  Textarea,
  Text,
} from "@mantine/core";
import { closeAllModals, modals } from "@mantine/modals";
import dayjs from "dayjs";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";

export type FundingStatuses = "pending" | "approved" | "rejected" | "cancelled";
export interface ApproveRejectCreditDebitPayload {
  id: number;
  status: FundingStatuses;
}

export interface ApproveRejectFundingPayload {
  id: number;
  status: FundingStatuses;
  admin_remark?: string;
}

export function ManualFundingDrawer({
  fundingData,
  closeDrawer,
}: {
  fundingData: IManualPayment | null;
  closeDrawer(): void;
}) {
  const [remark, setRemark] = useState("");
  const { mutate: approveReject, isLoading } =
    useApproveRejectFunding(closeDrawer);

  function handleApproveReject(status: FundingStatuses) {
    approveReject({
      id: fundingData!.id,
      status,
      admin_remark: remark,
    });
    setTimeout(() => {
    window.location.reload();
    }, 3000);
  }

  function confirmApproveReject(status: FundingStatuses) {
    if (remark.trim() === ""){
        return showNotification({
          title: "Error",
          message: `Remark cannot be empty. Kindly fill in a remark`,
          color: "red",
        });
    }
    
    modals.openConfirmModal({
      title: "Please confirm the following details",
      children: (
        <Text>
          {`Are you sure you want to ${
            status === "approved" ? "approve" : "reject"
          } this funding request?`}
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: {
        className: "bg-primary-100",
        loading: isLoading,
      },
      onCancel: closeAllModals,
      onConfirm: () => handleApproveReject(status),
    });
  }

  return (
    <Drawer
      title="Funding Details"
      opened={!!fundingData}
      position="right"
      onClose={closeDrawer}
      withCloseButton
      classNames={{
        content: "p-0",
        body: "p-0",
      }}
    >
      <Box p={20} className="border-b-2">
        <Stack spacing="sm">
          <Group position="apart">
            <span className="font-secondary text-xl font-semibold">
              {getCurrency(fundingData?.currency || "")}
              {currencyFormatter(Number(fundingData?.amount))}
            </span>
            <span>{fundingData?.category} transaction</span>
          </Group>

          <Group position="apart">
            <div>
              Status: <span className="text-accent">{fundingData?.status}</span>
            </div>
            <span>
              {dayjs(fundingData?.created_on).format("MMM D, YYYY h:mm A")}
            </span>
          </Group>
        </Stack>
      </Box>

      <Stack className="bg-gray-30 rounded" p={20}>
        <Group position="apart">
          <span>Sender name:</span>
          <span className="text-right text-gray-90 font-medium">
            {fundingData?.sender_name}
          </span>
        </Group>
        <Group position="apart">
          <span>Target Account:</span>
          <span className="text-right text-gray-90 font-medium">
            {fundingData?.target_account_label}
          </span>
        </Group>
        <Group position="apart">
          <span>Narration:</span>
          <span className="text-right text-gray-90 font-medium">
            {fundingData?.sender_narration}
          </span>
        </Group>
      </Stack>

      <Box p={20}>
        <Textarea
          placeholder="Enter remark"
          value={remark}
          required
          onChange={(e) => setRemark(e.target.value)}
          disabled={fundingData?.status !== "pending"}
        />
      </Box>

      <Group className="border-t" p={20} spacing="xs" position="apart" grow>
        <Button
          className="bg-primary-100 hover:bg-primary-100 text-white"
          size="lg"
          loaderPosition="right"
          onClick={() => confirmApproveReject("approved")}
          disabled={fundingData?.status !== "pending"}
        >
          Approve
        </Button>
        <Button
          className="bg-gray-30 hover:bg-gray-30 text-[#BA0000]"
          size="lg"
          onClick={() => confirmApproveReject("rejected")}
          disabled={fundingData?.status !== "pending"}
        >
          Reject
        </Button>
      </Group>
    </Drawer>
  );
}
