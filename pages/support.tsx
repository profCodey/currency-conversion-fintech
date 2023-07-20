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

      <form className="max-w-[800px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <TextInput size="lg" placeholder="Full name" />
          <TextInput size="lg" placeholder="Email" type="email" />
          <TextInput size="lg" placeholder="Business name" />
          <TextInput size="lg" placeholder="Job title" />
          <TextInput size="lg" placeholder="Phone number" />
          <TextInput size="lg" placeholder="Subject here" />
          <Textarea size="lg" placeholder="Subject here" />

          <Button
            size="lg"
            className="col-span-1 sm:col-span-2 mt-4 max-w-[350px] bg-primary-100 hover:bg-primary-100"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

Support.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
