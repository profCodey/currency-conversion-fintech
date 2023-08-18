import {
  useApproveRejectOnboardingDocuments,
  useClientDocuments,
} from "@/api/hooks/admin/users";
import { useGetBusinessDocuments } from "@/api/hooks/onboarding";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Skeleton,
  Stack,
  Table,
  Text,
  Textarea,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

export function ClientDocuments() {
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const router = useRouter();
  const { data: clientDocuments, isLoading: clientDocumentsLoading } =
    useClientDocuments(router?.query.id as string);

  const { mutate: approveRejectDocuments, isLoading } =
    useApproveRejectOnboardingDocuments(
      router?.query.id as string,
      closeModals
    );

  function handleApproveReject(status: "approved" | "rejected") {
    approveRejectDocuments({
      status,
      comment: rejectionReason || "",
    });
  }

  function handleDocumentRejection() {
    if (!rejectionReason) {
      return setReasonError(true);
    }
    handleApproveReject("rejected");
  }

  function closeModals() {
    setRejectModalOpen(false);
    setApproveModalOpen(false);
    setReasonError(false);
    setRejectionReason("");
  }

  const status = clientDocuments?.data.status;

  return (
    <section>
      <Box p={20}>
        <Skeleton visible={clientDocumentsLoading}>
          <Table withBorder>
            <thead>
              <tr>
                <th>Document name</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              <DocumentRow
                title="Certificate of registration"
                link={clientDocuments?.data.certificate_of_registration}
              />
              <DocumentRow
                title="Utility bill for business address"
                link={clientDocuments?.data.utility_bill}
              />
              <DocumentRow
                title="Article of Association"
                link={clientDocuments?.data.article_of_association}
              />
              <DocumentRow
                title="Document of directors"
                link={clientDocuments?.data.document_directors}
              />
              <DocumentRow
                title="Document of shareholders"
                link={clientDocuments?.data.document_shareholders}
              />
              <DocumentRow
                title="Applicable Regulatory licences"
                link={clientDocuments?.data.regulatory_licenses}
              />
            </tbody>
          </Table>
        </Skeleton>
      </Box>

      <Group position="apart" grow>
        {status !== "approved" && (
          <Group p={20}>
            <Button
              className="bg-primary-100 hover:bg-primary-100"
              onClick={() => setApproveModalOpen(true)}
            >
              Approve documents
            </Button>

            {/* {status === "pending" && ( */}
            <Button
              className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
              onClick={() => setRejectModalOpen(true)}
              disabled={status !== "pending"}
            >
              Reject documents
            </Button>
            {/* // )} */}
          </Group>
        )}

        <Group p={20}>
          <Text>Current status:</Text>
          <Badge
            variant="dot"
            color={
              status === "approved"
                ? "green"
                : status === "cancelled" || status === "rejected"
                ? "red"
                : "grape"
            }
          >
            {status}
          </Badge>
        </Group>
      </Group>

      <Modal
        onClose={() => setApproveModalOpen(false)}
        opened={approveModalOpen}
        withCloseButton={false}
        centered
      >
        <Stack spacing="xl">
          <Text className="text-xl font-semibold text-accent font-secondary">
            Approve Documents
          </Text>
          <Text className="text-lg">{`Are you sure you want to approve the documents uploaded?`}</Text>
          <Group position="center" grow>
            <Button
              size="md"
              className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
              onClick={() => setApproveModalOpen(false)}
            >
              No, Cancel
            </Button>
            <Button
              size="md"
              className="bg-primary-100 hover:bg-primary-100"
              loading={isLoading}
              onClick={() => handleApproveReject("approved")}
            >
              Yes, Approve
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        onClose={() => setRejectModalOpen(false)}
        opened={rejectModalOpen}
        withCloseButton={false}
        centered
      >
        <Stack spacing="xl">
          <Text className="text-xl font-semibold text-accent font-secondary">
            Reject Documents
          </Text>
          <Text className="text-lg">{`Are you sure you want to reject the documents uploaded?`}</Text>

          <Stack spacing="xs">
            <Textarea
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setReasonError(false);
              }}
              required
            />

            {reasonError && (
              <small className="text-red-600">
                Enter a reason for rejection
              </small>
            )}
          </Stack>
          <Group position="center" grow>
            <Button
              size="md"
              className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
              onClick={() => setRejectModalOpen(false)}
            >
              No, Cancel
            </Button>
            <Button
              size="md"
              className="bg-primary-100 hover:bg-primary-100"
              onClick={handleDocumentRejection}
              loading={isLoading}
            >
              Yes, Reject
            </Button>
          </Group>
        </Stack>
      </Modal>
    </section>
  );
}

function DocumentRow({
  title,
  link,
}: {
  title: string;
  link: string | undefined;
}) {
  return (
    <tr>
      <td>{title}</td>
      <td>
        {link ? (
          <Anchor href={link} target="_blank" className="text-accent">
            View
          </Anchor>
        ) : (
          <span className="text-gray-70">Not uploaded</span>
        )}
      </td>
    </tr>
  );
}
