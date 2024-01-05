import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import { IFxPayout } from "@/utils/validators/interfaces";
import {
  Box,
  Button,
  Drawer,
  Group,
  Skeleton,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { FundingStatuses } from "./manual-funding-drawer";
import { useState } from "react";
import { closeAllModals, modals } from "@mantine/modals";
import { useApproveRejectFxPayout } from "@/api/hooks/admin/fx";
import dayjs from "dayjs";
import { currencyFormatter } from "@/utils/currency";

export function FxPayoutDetail({
  open,
  payout,
  closeDrawer,
}: {
  open: boolean;
  payout: IFxPayout | null;
  closeDrawer(): void;
}) {
  const [remark, setRemark] = useState("");
  const { role, isLoading: rolesLoading } = useRole();
  const isAdmin = role === USER_CATEGORIES.ADMIN;

  const { mutate: approveReject, isLoading } =
    useApproveRejectFxPayout(closeDrawer);

  function handleApproveReject(status: FundingStatuses) {
    approveReject({
      id: payout!.id,
      status,
      admin_remark: remark,
    });
  }

  function confirmApproveReject(status: FundingStatuses) {
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
      zIndex: 500,
      onCancel: closeAllModals,
      onConfirm: () => handleApproveReject(status),
    });
  }

  return (
    <Drawer
      title="Payout detail"
      position="right"
      opened={open}
      onClose={closeDrawer}
      classNames={{
        content: "p-0",
        body: "p-0",
      }}
    >
      <Box p={20} className="border-b-2">
        <Stack spacing="sm">
          <Group position="apart">
            <span className="font-secondary text-xl font-semibold">
              {currencyFormatter(Number(payout?.amount))}
            </span>
            <span>{payout?.account_name} transaction</span>
          </Group>

          <Group position="apart">
            <div>
              Status: <span className="text-accent">{payout?.status}</span>
            </div>
            <span>
              {dayjs(payout?.created_on).format("MMM D, YYYY h:mm A")}
            </span>
          </Group>
        </Stack>
      </Box>
      <Stack spacing="md" p={20} className="bg-gray-30">
        <Detail title="Account number" content={payout?.account_number} />
        <Detail title="Bank Name" content={payout?.bank_name} />
        <Detail title="Destination Currency" content={payout?.destination_currency_code} />
        <Detail title="Sending Amount" content={payout?.amount} />
        <Detail title="BIC" content={payout?.bic} />
        <Detail title="IBAN" content={payout?.iban} />
        <Detail title="Created by" content={payout?.created_by_name} />
        <Detail title="Sort code" content={payout?.sort_code} />
        <Detail title="Zip code" content={payout?.zipcode} />
        <Detail title="Narration" content={payout?.narration} />
        <Detail title="Admin remarks" content={payout?.admin_remarks} />
        <Detail title="Recipient address" content={payout?.recipient_address} />
        <Detail title="State" content={payout?.state} />
        <Detail title="City" content={payout?.city} />
        <Detail title="Reference" content={payout?.reference} />
          <DetailLink
            title="Invoice"
            content="Invoice"
            link={payout?.invoice}
          />
         <DetailLink 
         title="Source of Fund"
         content="Source of Fund"
         link={payout?.source_of_fund}
         />
      </Stack>

      {isAdmin && (
        <Skeleton visible={rolesLoading}>
          <Stack>
            <Box p={20} className="border-y mt-5">
              <Textarea
                placeholder="Enter remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={payout?.status !== "pending"}
              />
            </Box>
            <Group p={20} spacing="xs" position="apart" grow>
              <Button
                className="bg-primary-100 hover:bg-primary-100 text-white"
                size="lg"
                loaderPosition="right"
                onClick={() => confirmApproveReject("approved")}
                disabled={payout?.status !== "pending"}
              >
                Approve
              </Button>
              <Button
                className="bg-gray-30 hover:bg-gray-30 text-[#BA0000]"
                size="lg"
                onClick={() => confirmApproveReject("rejected")}
                disabled={payout?.status !== "pending"}
              >
                Reject
              </Button>
            </Group>
          </Stack>
        </Skeleton>
      )}
    </Drawer>
  );
}

function Detail({
  title,
  content,
}: {
  title: string;
  content: string | number | undefined;
}) {
  if (!content) return null;
  return (
    <div className="flex w-full">
      <span className="font-semibold flex-shrink-0">{title}:</span>
      <span className="flex-grow text-right">{content || "Nil"}</span>
    </div>
  );
}

function DetailLink({
  title,
  content,
  link,
}: {
  title: string;
  content: string;
  link: string;
}) {
  return (
    <div className="flex w-full">
      <span className="font-semibold flex-shrink-0">{title}:</span>
      <a
        href={link}
        target="_blank"
        className="flex-grow text-right text-blue-500 underline"
        download
      >
        {content}
      </a>
    </div>
  );
}
