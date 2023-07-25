import { useCloseSupportRequest } from "@/api/hooks/user";
import { ISupport } from "@/utils/validators/interfaces";
import { Button, Drawer, Group, Stack } from "@mantine/core";
import dayjs from "dayjs";

export function SupportDrawer({
  supportData,
  closeDrawer,
}: {
  supportData: ISupport | null;
  closeDrawer(): void;
}) {
  const { mutate: closeRequest, isLoading } =
    useCloseSupportRequest(closeDrawer);

  return (
    <Drawer
      title="Support Request Details"
      opened={!!supportData}
      position="right"
      onClose={closeDrawer}
      withCloseButton
      classNames={{
        content: "p-0",
        body: "p-0",
      }}
    >
      <Stack className="bg-gray-30 rounded" p={20}>
        <Group position="apart">
          <span>Date created</span>
          <span className="text-right text-gray-90 font-medium">
            {dayjs(supportData?.created_on).format("MMMM D, YYYY h:mm A")}
          </span>
        </Group>
        <Group position="apart">
          <span>Job title:</span>
          <span className="text-right text-gray-90 font-medium">
            {supportData?.job_title}
          </span>
        </Group>
        <Group position="apart">
          <span>Phone number:</span>
          <span className="text-right text-gray-90 font-medium">
            {supportData?.phone_number}
          </span>
        </Group>

        <Group position="apart">
          <span>Business name:</span>
          <span className="text-right text-gray-90 font-medium">
            {supportData?.business_name}
          </span>
        </Group>
        <Group position="apart">
          <span>Full name:</span>
          <span className="text-right text-gray-90 font-medium">
            {supportData?.full_name}
          </span>
        </Group>
        <Group position="apart">
          <span>E-mail:</span>
          <span className="text-right text-gray-90 font-medium">
            {supportData?.email}
          </span>
        </Group>
        <Group position="apart">
          <span>Message:</span>
          <span className="text-right text-gray-90 font-medium">
            {supportData?.message}
          </span>
        </Group>
        <Group position="apart">
          <span>Request Status:</span>
          {supportData?.is_closed ? (
            <span className="text-right text-accent font-medium">Closed</span>
          ) : (
            <span className="text-right text-gray-90 font-medium">Open</span>
          )}
        </Group>
      </Stack>

      <Group className="border-t" p={20} grow>
        <Button
          className="bg-primary-100 hover:bg-primary-100 text-white"
          size="lg"
          loading={isLoading}
          loaderPosition="right"
          onClick={() => closeRequest(supportData as ISupport)}
          disabled={supportData?.is_closed}
        >
          Close
        </Button>
      </Group>
    </Drawer>
  );
}
