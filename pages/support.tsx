import { AppLayout } from "@/layout/common/app-layout";
import { Button, TextInput, Textarea } from "@mantine/core";
import { ReactElement } from "react";

export default function Support() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>Support</h2>
        <span>Do you need our help?</span>
      </div>

      <div>
        <form className="max-w-[800px] grid grid-cols-2 gap-x-8 gap-y-4">
          <TextInput size="md" placeholder="Full name" />
          <TextInput size="md" placeholder="Email" type="email" />
          <TextInput size="md" placeholder="Business name" />
          <TextInput size="md" placeholder="Job title" />
          <TextInput size="md" placeholder="Phone number" />
          <TextInput size="md" placeholder="Subject here" />
          <Textarea placeholder="Subject here" />

          <Button
            size="md"
            className="col-span-2 mt-4 max-w-[350px] bg-primary-100 hover:bg-primary-100"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

Support.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
