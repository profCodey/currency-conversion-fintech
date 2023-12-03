import { PageHeader } from "@/components/admin/page-header";
import {
 ActionIcon,
 Button,
 Drawer,
 Text,
 LoadingOverlay,
 Menu,
 Group,
 Table,
 Skeleton,
} from "@mantine/core";
import { USER_CATEGORIES } from "@/utils/constants";
import { useRole } from "@/api/hooks/user";
import { ICreditDebit } from '@/utils/validators/interfaces'; 
import { More } from "iconsax-react";
import { AddCreditDebitButton } from "@/layout/admin/creditdebit/add-new";
import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
 useGetCreditDebit,
 useUpdateCreditDebitStatus,
} from "@/api/hooks/admin/creditdebit";
import { formatDateTime } from "@/utils/dateTime";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { modals, closeAllModals } from "@mantine/modals";
import { FundingStatuses } from "@/layout/transactions/manual-funding-drawer";
export default function CreditDebit() {
 const router = useRouter();
 const { role, isLoading: rolesLoading } = useRole();
 const isAdmin = role === USER_CATEGORIES.ADMIN;
 const { data: creditdebit, isLoading: creditdebitLoading } = useGetCreditDebit(
  router.query.id as string
 );
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 const [selectedCreditDebit, setSelectedCreditDebit] =
  useState<ICreditDebit | null>(null);
 const [selectedCreditDebitId, setSelectedCreditDebitId] = useState<
  number | null
 >(null);
 //  const ChangeStatusForm = useForm({
 //   initialValues: {
 //    status: "pending",
 //   },
 //   validate: zodResolver(ChangeStatusValidator),
 //  });
 const openDrawer = useCallback((creditdebit: ICreditDebit) => {
  setIsDrawerOpen(true);
  setSelectedCreditDebit(creditdebit);
  setSelectedCreditDebitId(creditdebit.id);
 }, []);
 const closeDrawer = useCallback(() => {
  setIsDrawerOpen(false);
  setSelectedCreditDebit(null);
  setSelectedCreditDebitId(null);
 }, []);
 const { mutate: changeStatus, isLoading } =
  useUpdateCreditDebitStatus(closeDrawer);
 function handleNewStatusChange(status: FundingStatuses) {
  if (selectedCreditDebitId !== null) {
   changeStatus({
    id: selectedCreditDebitId,
    status,
   });
  }
 }
 const _rows = useMemo(
  function () {
   return creditdebit?.data.map(function (
    creditdebit: ICreditDebit,
    idx: number
   ) {
    return (
     <>
      <tr
       key={creditdebit.id}
       className="cursor-pointer hover:bg-gray-100"
       onClick={() => openDrawer(creditdebit)}>
       <td>{idx + 1}</td>
       {/* <td>{creditdebit.client_selected_gateway}</td> */}
       <td>{creditdebit.selected_gateway_label}</td>
       <td>{creditdebit.amount}</td>
       <td>{creditdebit.narration}</td>
       <td>{creditdebit.transaction_type}</td>
       <td>{creditdebit.status}</td>
      </tr>
     </>
    );
   });
  },
  [creditdebit?.data]
 );
 function handleSubmit(status: FundingStatuses, transaction_type: string | undefined) {
  modals.openConfirmModal({
    title: <Text className="font-secondary">Please confirm your action</Text>,
    children: (
     <Text size="sm">{`Are you sure you want to ${
        status === "approved" ? "approve" : "reject"
      } this ${transaction_type === "credit" ? "credit" : "debit"} request?`}</Text>
    ),
    labels: { confirm: "Yes, approve", cancel: "No, Cancel" },
    confirmProps: {
     color: "bg-primary-100",
     className: "bg-red-600 hover:bg-red-500",
    },
   onCancel: closeAllModals,
   onConfirm: () => handleNewStatusChange(status),
  });
 }
 return (
  <section className="flex flex-col gap-6 p-5 h-full">
   <div className="flex flex-row justify-between">
    <div className="flex flex-col">
     <span className="text-2xl font-secondary">Credit/Debit </span>
    </div>
    <AddCreditDebitButton />
   </div>
   <section>
    <Table
     verticalSpacing="xs"
     withBorder
     className="min-h-[20vh] max-h-[50vh] overflow-y-auto relative">
     {/* <LoadingOverlay visible={creditdebitLoading || isLoading} /> */}
     <thead>
      <tr className="font-primary font-light">
       <th>S/N</th>
       {/* <th>Gateway Id</th> */}
       <th>Gateway Name</th>
       <th>Amount</th>
       <th>Remarks</th>
       <th>Transaction Type</th>
       <th>Status</th>
      </tr>
     </thead>
     <tbody>{_rows}</tbody>
     <Drawer
      title="Credit/Debit Details"
      opened={isDrawerOpen}
      onClose={closeDrawer}
      size="md"
      className="relative"
      position="right">
      <LoadingOverlay visible={creditdebitLoading} />
      <Text className="flex flex-row">
       <span className="w-1/2">Id:</span>{" "}
       <span className="w-1/2">{selectedCreditDebit?.id}</span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Gateway:</span>{" "}
       <span className="w-1/2">
        {selectedCreditDebit?.client_selected_gateway}
       </span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Amount:</span>{" "}
       <span className="w-1/2">{selectedCreditDebit?.amount}</span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Remarks:</span>{" "}
       <span className="w-1/2">{selectedCreditDebit?.narration}</span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Transaction Type:</span>{" "}
       <span className="w-1/2">{selectedCreditDebit?.transaction_type}</span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Status:</span>{" "}
       <span className="w-1/2">{selectedCreditDebit?.status}</span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Reference:</span>{" "}
       <span className="w-1/2">{selectedCreditDebit?.reference}</span>
      </Text>
      <Text className="flex flex-row">
       <span className="w-1/2">Created On:</span>{" "}
       <span className="w-1/2">
        {selectedCreditDebit
         ? formatDateTime(selectedCreditDebit.created_on)
         : ""}
       </span>
      </Text>
      {isAdmin && (
       <Skeleton visible={rolesLoading}>
        <Group p={20} spacing="xs" position="apart" grow>
         <Button
          className="bg-primary-100 hover:bg-primary-100 text-white"
          size="lg"
          loaderPosition="right"
          onClick={() => handleSubmit("approved", selectedCreditDebit?.transaction_type || "")}
          disabled={selectedCreditDebit?.status !== "pending"}>
          
          Approve
         </Button>
         <Button
          className="bg-gray-30 hover:bg-gray-30 text-[#BA0000]"
          size="lg"
          onClick={() => handleSubmit("rejected", selectedCreditDebit?.transaction_type || "")}
          disabled={selectedCreditDebit?.status !== "pending"}>
          Reject
         </Button>
        </Group>
       </Skeleton>
      )}
     </Drawer>
    </Table>
   </section>
  </section>
 );
}
CreditDebit.getLayout = function getLayout(page: ReactElement) {
 return <AppLayout>{page}</AppLayout>;
};