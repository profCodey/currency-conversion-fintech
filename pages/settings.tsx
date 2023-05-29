import { AppLayout } from "@/layout/common/app-layout";
import { ChangeNumberForm, ChangePasswordForm } from "@/layout/settings";
import { Modal, Stack, } from "@mantine/core";
import { ReactElement, useState } from "react";

export default function Settings() {
  const [modalState, setModalState] = useState<null | "number" | "password">(
    null
  );

  function getModalTitle() {
    switch (modalState) {
      case "number":
        return "Change Phone number";
      case "password":
        return "Change Password";
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Settings</h2>
        <span>Edit and Secure your profile here</span>
      </div>

      <Stack spacing="xl" className="text-accent">
        <span className="cursor-pointer" tabIndex={1} aria-label="Change email">
          Change Email
        </span>
        <span
          className="cursor-pointer"
          tabIndex={1}
          aria-label="Change phone number"
          onClick={() => setModalState("number")}
        >
          Change Phone Number
        </span>
        <span
          className="cursor-pointer"
          tabIndex={1}
          aria-label="Change password"
          onClick={() => setModalState("password")}
        >
          Change Password
        </span>
        <span className="cursor-pointer" tabIndex={1} aria-label="Setup 2fa">
          Two-factor authentication
        </span>
      </Stack>

      <Modal
        opened={!!modalState}
        centered
        title={
          <span className="font-secondary text-accent text-xl">
            {getModalTitle()}
          </span>
        }
        onClose={() => setModalState(null)}
      >
        {modalState === "number" && <ChangeNumberForm />}
        {modalState === "password" && <ChangePasswordForm />}
      </Modal>
    </div>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
