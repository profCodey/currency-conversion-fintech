import { useSendSupportRequest } from "@/api/hooks/user";
import { AppLayout } from "@/layout/common/app-layout";
import { Button, TextInput, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ReactElement } from "react";
import { z } from "zod";
import Cookies from "js-cookie";

export const supportFormValidator = z.object({
  full_name: z.string().optional(),
  business_name: z.string().optional(),
  email: z.string().email("Enter valid email"),
  phone_number: z.string().optional(),
  job_title: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Enter message"),
});
export default function Support() {
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
    let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
    let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  const supportForm = useForm({
    initialValues: {
      full_name: "",
      business_name: "",
      email: "",
      phone_number: "",
      job_title: "",
      subject: "",
      message: "",
    },
    validate: zodResolver(supportFormValidator),
  });

  const { mutate: sendRequest, isLoading } = useSendSupportRequest(
    supportForm.reset
  );

  function handleSubmit(values: z.infer<typeof supportFormValidator>) {
    sendRequest(values);
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div style={{ color: colorPrimary }}>
        <h2 className={"text-2xl font-secondary mt-2"}>Support</h2>
        <span>Do you need our help?</span>
      </div>

      <form
        className="max-w-[800px]"
        onSubmit={supportForm.onSubmit(handleSubmit)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <TextInput
            size="lg"
            placeholder="Full name"
            {...supportForm.getInputProps("full_name")}
          />
          <TextInput
            size="lg"
            placeholder="Email"
            type="email"
            withAsterisk
            {...supportForm.getInputProps("email")}
          />
          <TextInput
            size="lg"
            placeholder="Business name"
            {...supportForm.getInputProps("business_name")}
          />
          <TextInput
            size="lg"
            placeholder="Job title"
            {...supportForm.getInputProps("job_title")}
          />
          <TextInput
            size="lg"
            placeholder="Phone number"
            {...supportForm.getInputProps("phone_number")}
          />
          <TextInput
            size="lg"
            placeholder="Subject here"
            {...supportForm.getInputProps("subject")}
          />
          <Textarea
            size="lg"
            withAsterisk
            placeholder="Enter message"
            {...supportForm.getInputProps("message")}
          />

          <Button
            loading={isLoading}
            loaderPosition="right"
            type="submit"
            size="lg"
            className="col-span-1 sm:col-span-2 mt-4 max-w-[350px] "
            style={{ backgroundColor: colorBackground }}
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
