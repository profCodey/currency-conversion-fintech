import { ActionIcon, Badge } from "@mantine/core";
import { NotificationIcon } from "../icons/icons";
import { ReactNode } from "react";
import { Drawer, Text } from "@mantine/core";
import { INotification } from "@/utils/validators/interfaces";
import { closeAllModals, modals } from "@mantine/modals";
import { useGetNotifications, useDeleteNotification } from "@/api/hooks/admin/notification";
import { useState, useMemo } from "react";
import { BinDelete } from "@/components/icons";
import Cookies from "js-cookie";


export function PageHeader({
  header,
  subheader,
  meta,
}: {
  header: ReactNode;
  subheader?: ReactNode;
  meta?: ReactNode;
}) {
  const { data, isLoading: notificationsLoading } = useGetNotifications();
  console.log(data)
  console.log(data?.data.length)
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
const { mutate: deleteNotification, isLoading: deleteNotificationLoading } = useDeleteNotification();
  function handleDeleteNotification(notification: INotification) {
    deleteNotification(notification.id);
  }
  const notificationCount = data? data.data.length : 0;

  const _notifications = useMemo(
    function () {
      if (!data) return null;
      if (data.data.length === 0) {
        // Display "No notifications" message when there are no notifications
        return <Text size="sm">No notifications</Text>;
      }
      return data.data.map((notification: INotification, index: number) => (
        <div key={index} className="flex items-center cursor-pointer border-b hover:bg-gray-200 p-2 justify-between">
          <span className="text-sm ">{notification.message}</span>
          <span className="cursor-pointer ">
            <BinDelete 
           
            onClick={() => handleDeleteNotification(notification)}
            />
          </span>
        </div>
      ));
    },
    [data]
  );

function handleNotificationClick () {
  setNotificationsModalOpen(true)
}
let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";

  return (
    <section className="flex gap-5 items-start">
      <div className="text-primary-100 mr-auto">
        <h2 
        style={{color:colorPrimary}}
        className="text-2xl font-secondary">{header}</h2>
        <span
        style={{color:colorPrimary}}
        >{subheader}</span>
      </div>

      <div className="flex gap-5 items-center">
        {meta}
        <ActionIcon>
        
        <NotificationIcon notificationCount={notificationCount} onClick={handleNotificationClick} />
        </ActionIcon>
        <Drawer
          opened={notificationsModalOpen}
          onClose={() => setNotificationsModalOpen(false)}
          size="md"
          padding="xl"
          position="right"
          title="Notifications">
            {_notifications}

          </Drawer>
          </div>
    </section>
  );
}
