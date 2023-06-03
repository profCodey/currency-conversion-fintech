import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement } from "react";
import { Tabs, Loader } from "@mantine/core";
import { BasicProfileForm } from "@/layout/onboarding";
import { useGetCurrentUser } from "@/api/hooks/user";
import { useGetBasicProfile } from "@/api/hooks/onboarding";

export default function Onboarding() {
  const { data } = useGetCurrentUser();
  const { data: basicProfile, isLoading } = useGetBasicProfile(data?.data.id);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center gap-4">
        <span>Loading profile...</span>{" "}
        <Loader size="lg" variant="bars" color="green" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-primary-100">
        <h2 className={"text-2xl font-secondary mt-2"}>
          Welcome, <span className="font-semibold">{data?.data.last_name}</span>
        </h2>
        <span>
          {`Let's get started! Complete set up your profile and begin exploring
          the Dashboard.`}
        </span>
      </div>
      <section className="rounded-lg bg-gray-30 border text-gray-90 p-5">
        <Tabs defaultValue="basic-profile">
          <Tabs.List>
            <Tabs.Tab value="basic-profile">Basic Profile</Tabs.Tab>
            <Tabs.Tab value="id-verification">ID Verification</Tabs.Tab>
            <Tabs.Tab value="document-upload">Document Upload</Tabs.Tab>
            <Tabs.Tab value="gateway-options">Gateway Options</Tabs.Tab>
            <Tabs.Tab value="status">Status</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic-profile" pt="lg">
            <BasicProfileForm formData={basicProfile?.data} />
          </Tabs.Panel>
          <Tabs.Panel value="id-verification" pt="lg">
            ID Verification
          </Tabs.Panel>
          <Tabs.Panel value="document-upload" pt="lg">
            Document Upload
          </Tabs.Panel>
          <Tabs.Panel value="gateway-options" pt="lg">
            Gateway Options
          </Tabs.Panel>
          <Tabs.Panel value="status" pt="lg">
            Status
          </Tabs.Panel>
        </Tabs>
      </section>
    </div>
  );
}

Onboarding.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
