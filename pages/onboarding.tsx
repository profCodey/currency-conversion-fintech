import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement, useState } from "react";
import { Tabs, Loader, Skeleton } from "@mantine/core";
import {
  BasicProfileForm,
  DocumentUpload,
  GatewayOptions,
  OnboardingStatus,
} from "@/layout/onboarding";
import { useGetCurrentUser } from "@/api/hooks/user";
import {
  useGetBasicProfile,
  useGetBusinessDocuments,
} from "@/api/hooks/onboarding";
import { useGetSelectedGateways } from "@/api/hooks/gateways";

export default function Onboarding() {
  const [activeTab, setActiveTab] = useState<string | null>("basic-profile");
  const { data } = useGetCurrentUser();
  const { data: basicProfile, isLoading } = useGetBasicProfile(data?.data.id);
  const { data: documents, isLoading: documentLoading } =
    useGetBusinessDocuments(data?.data.id);
  const { data: userSelectedGateways, isLoading: userSelectedGatewaysLoading } =
    useGetSelectedGateways();

  if (isLoading || documentLoading || userSelectedGatewaysLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <Skeleton height={100} />
        <Skeleton className="flex-grow" />
      </div>
    );
  }

  const disableProfileFields = Boolean(
    basicProfile?.data?.business_legal_name &&
      (basicProfile?.data.status === "pending" ||
        basicProfile?.data?.status === "approved")
  );

  const disableDocumentNextButton = function () {
    const {
      certificate_of_registration,
      utility_bill,
      article_of_association,
      document_directors,
      document_shareholders,
    } = documents?.data || {};
    if (
      [
        certificate_of_registration,
        utility_bill,
        article_of_association,
        document_directors,
        document_shareholders,
      ].every((doc) => Boolean(doc))
    ) {
      return false;
    }
    return true;
  };

  const disableGatewayNextButton = userSelectedGateways?.data.length === 0;

  function handleTabChange(tab: string) {
    if (tab === "basic-profile") setActiveTab(tab);
    // else if (tab === "id-verification" && disableProfileFields)
    //   setActiveTab(tab);
    else if (tab === "document-upload" && disableProfileFields)
      setActiveTab(tab);
    else if (tab === "gateway-options" && !disableDocumentNextButton())
      setActiveTab(tab);
    else if (tab === "status" && !disableGatewayNextButton) setActiveTab(tab);
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
      <section className="rounded-lg bg-gray-30 border text-gray-90 p-5 flex-grow">
        <Tabs
          defaultValue="basic-profile"
          value={activeTab}
          onTabChange={handleTabChange}
          classNames={{
            root: "h-[95%]",
            panel: "h-full flex-grow",
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="basic-profile">Basic Profile</Tabs.Tab>
            {/* <Tabs.Tab value="id-verification">ID Verification</Tabs.Tab> */}
            <Tabs.Tab value="document-upload">Document Upload</Tabs.Tab>
            <Tabs.Tab value="gateway-options">Gateway Options</Tabs.Tab>
            <Tabs.Tab value="status">Status</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic-profile" pt="lg">
            <BasicProfileForm
              formData={basicProfile?.data}
              nextTab={setActiveTab}
              disableFields={disableProfileFields}
            />
          </Tabs.Panel>
          {/* <Tabs.Panel value="id-verification" pt="lg">
            <IdVerification />
          </Tabs.Panel> */}
          <Tabs.Panel value="document-upload" pt="lg">
            <DocumentUpload
              formData={documents?.data}
              disableDocumentNextButton={disableDocumentNextButton()}
              nextTab={setActiveTab}
            />
          </Tabs.Panel>
          <Tabs.Panel value="gateway-options" pt="lg">
            <GatewayOptions
              userSelectedGateways={userSelectedGateways?.data}
              nextTab={setActiveTab}
            />
          </Tabs.Panel>
          <Tabs.Panel value="status" pt="lg">
            <OnboardingStatus />
          </Tabs.Panel>
        </Tabs>
      </section>
    </div>
  );
}

Onboarding.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
