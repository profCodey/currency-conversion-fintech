import { useRole } from "@/api/hooks/user";
import { USER_CATEGORIES } from "@/utils/constants";
import { IExchangeDetailed } from "@/utils/validators/interfaces";
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
import { useApproveRejectExchange } from "@/api/hooks/exchange";
import { currencyFormatter } from "@/utils/currency";
import dayjs from "dayjs";

export function FxExchangeDetail({
  open,
  exchange,
  closeDrawer,
}: {
  open: boolean;
  exchange: IExchangeDetailed | null;
  closeDrawer(): void;
}) {
  const [remark, setRemark] = useState("");
  const { role, isLoading: rolesLoading } = useRole();
  const isAdmin = role === USER_CATEGORIES.ADMIN;

  const { mutate: approveReject, isLoading } =
    useApproveRejectExchange(closeDrawer);

  function handleApproveReject(status: FundingStatuses) {
    approveReject({
      id: exchange!.id,
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
      closeOnConfirm: false,
      closeOnCancel: false,
      onCancel: closeAllModals,
      onConfirm: () => handleApproveReject(status),
    });
  }

  return (
    <Drawer
      title="Exchange details"
      withCloseButton={false}
      position="right"
      opened={open}
      onClose={closeDrawer}
      classNames={{
        content: "p-0",
        body: "p-0",
      }}
    >
      <Stack spacing="sm" p={20} className="border-b">
        <Group position="apart">
          <span className="font-secondary text-xl font-semibold">
            Amount: {currencyFormatter(Number(exchange?.amount))}
          </span>
          <span>{exchange?.created_by_name}</span>
        </Group>
        

        <Group position="apart">
          <div>
            Status: <span className="text-accent">{exchange?.status}</span>
          </div>
          <span>
            {dayjs(exchange?.created_on).format("MMM D, YYYY h:mm A")}
          </span>
        </Group>
        <span>Rate: {exchange?.rate}</span>
      </Stack>

      <Stack p={20} spacing="md" className="bg-gray-30">
        {/* <Box>
          <Text>Source account</Text>
          <Detail
            title="Gateway Name"
            content={exchange?.source_account_detail.label}
          />
          <Detail
            title="Category"
            content={exchange?.source_account_detail.category}
          />
          <Detail
            title="Currency"
            content={exchange?.source_account_detail.currency.name}
          />
             <Detail
            title="Bank Name"
            content={exchange?.source_account_detail.bank_name}
          />
            <Detail
            title="Account Name"
            content={exchange?.source_account_detail.account_name}
          />
            <Detail
            title="Account Number"
            content={exchange?.source_account_detail.account_number}
          />
          <Detail
            title="Balance"
            content={exchange?.source_account_detail.true_balance}
          />
        </Box> */}
        <Box className="border-t" py={20}>
          <p className="font-bold">DESTINATION ACCOUNT</p>
          <Detail
            title="Gateway Name"
            content={exchange?.destination_account_detail.label}
          />
          <Detail
            title="Category"
            content={exchange?.destination_account_detail.category}
          />
          <Detail
            title="Currency"
            content={exchange?.destination_account_detail.currency.name}
          />
                 <Detail
            title="Bank Name"
            content={exchange?.destination_account_detail.bank_name}
          />
            <Detail
            title="Account Name"
            content={exchange?.destination_account_detail.account_name}
          />
            <Detail
            title="Account Number"
            content={exchange?.destination_account_detail.account_number}
          />
          <Detail
            title="Balance"
            content={exchange?.destination_account_detail.true_balance}
          />
        </Box>
      </Stack>

      {isAdmin && (
        <Skeleton visible={rolesLoading}>
          <Stack>
            <Box p={20} className="border-y mt-5">
              <Textarea
                placeholder="Enter remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={exchange?.status !== "pending"}
              />
            </Box>
            <Group p={20} spacing="xs" position="apart" grow>
              <Button
                className="bg-primary-100 hover:bg-primary-100 text-white"
                size="lg"
                loaderPosition="right"
                onClick={() => confirmApproveReject("approved")}
                disabled={exchange?.status !== "pending"}
              >
                Approve
              </Button>
              <Button
                className="bg-gray-30 hover:bg-gray-30 text-[#BA0000]"
                size="lg"
                onClick={() => confirmApproveReject("rejected")}
                disabled={exchange?.status !== "pending"}
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
  return (
    <div className="flex w-full">
      <span className="font-semibold flex-shrink-0">{title}:</span>
      <span className="flex-grow text-right">{content || "Nil"}</span>
    </div>
  );
}
