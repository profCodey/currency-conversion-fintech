import { ActionIcon } from "@mantine/core";
import NotificationAlert from "@/public/notification-alert.svg";
import { ReactNode } from "react";

export function PageHeader({
  header,
  subheader,
  meta,
}: {
  header: ReactNode;
  subheader?: string;
  meta?: ReactNode;
}) {
  return (
    <section className="flex gap-5 items-start">
      <div className="text-primary-100 mr-auto">
        <h2 className="text-2xl font-secondary">{header}</h2>
        <span>{subheader}</span>
      </div>

      <div className="flex gap-5 items-center">
        {meta}
        <ActionIcon>
          <NotificationAlert />
        </ActionIcon>
      </div>
    </section>
  );
}
