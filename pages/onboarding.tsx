import { AppLayout } from "@/layout/common/app-layout";
import { ReactElement, useState } from "react";
import { Tabs, Loader, Skeleton } from "@mantine/core";
import {
  BasicProfileForm,
  DocumentUpload,
  GatewayOptions,
  IdVerification,
  OnboardingStatus,
} from "@/layout/onboarding";
import { useGetCurrentUser } from "@/api/hooks/user";
import {
  useGetAccountDetails,
  useGetBasicProfile,
  useGetBusinessDocuments,
} from "@/api/hooks/onboarding";
import {
  useDefaultGateway,
  useGetSelectedGateways,
} from "@/api/hooks/gateways";
import { CLIENT_TYPES } from "@/utils/constants";
import { BusinessProfileForm } from "@/layout/onboarding/business-profile-form";
import { InvidualProfileForm } from "@/layout/onboarding/invidual-profile-form";
import { AccountDetailForm } from "@/layout/onboarding/account-detail-form";
import { useBankOptions, useGetBanks } from "@/api/hooks/banks";

export default function Onboarding() {
  const [activeTab, setActiveTab] = useState<string | null>("basic-profile");
  const { data } = useGetCurrentUser();
  // console.log({ userData: data?.data });
  const {
    bankOptions,
    getBankName,
    isLoading: isLoadingBanks,
  } = useBankOptions();
  const { isLoading: defaultGateWayLoading, defaultGateway } =
    useDefaultGateway();
  const { data: basicProfile, isLoading } = useGetBasicProfile(data?.data.id);
  // console.log({ basicProfile });

  const { data: documents, isLoading: documentLoading } =
    useGetBusinessDocuments(data?.data.id);
  const { data: accountDetails, isLoading: accountLoading } =
    useGetAccountDetails();

  // console.log({ accountDetails:accountDetails?.data });

  // console.log({ documents });

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

  const disableBusinessProfileFields = Boolean(
    basicProfile?.data?.business_legal_name &&
      (basicProfile?.data.status === "pending" ||
        basicProfile?.data?.status === "approved")
  );
  
  const showIndividualProfileNextBtn = Boolean(
    data?.data?.client_type === CLIENT_TYPES.INDIVIDUAL && !basicProfile?.data.business_name && (basicProfile?.data.state || basicProfile?.data.city)
  );

  const disableAccountDetails = Boolean(true);

  const disableBusinessDocumentNextButton = function () {
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

  const showAccountDetailNextBtn = Boolean(
    accountDetails?.data?.account_name && accountDetails?.data?.account_number
  )
  function handleTabChange(tab: string) {
    if (tab === "basic-profile") setActiveTab(tab);
    else if (tab === "id-verification") {
      setActiveTab(tab);
    } else if (tab === "document-upload" && disableBusinessProfileFields) {
      if (data?.data.client_type === CLIENT_TYPES.CORPORATE) {
        setActiveTab(tab);
      }
    } else if (tab === "account-detail") setActiveTab(tab);
    // else if (tab === "gateway-options" && !disableDocumentNextButton())
    //   setActiveTab(tab);
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
            <Tabs.Tab value="id-verification">ID Verification</Tabs.Tab>
            {data?.data?.client_type === CLIENT_TYPES.CORPORATE && (
              <Tabs.Tab value="document-upload">Document Upload</Tabs.Tab>
            )}
            {/* <Tabs.Tab value="gateway-options">Gateway Options</Tabs.Tab> */}
            <Tabs.Tab value="account-detail">Account Detail</Tabs.Tab>
            <Tabs.Tab value="status">Status</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic-profile" pt="lg">
            {/* <BasicProfileForm
              formData={basicProfile?.data}
              nextTab={setActiveTab}
              disableFields={disableProfileFields}
            /> */}

            {data?.data?.client_type === CLIENT_TYPES.CORPORATE ? (
              <BusinessProfileForm
                formData={basicProfile?.data}
                nextTab={handleTabChange}
                disableFields={disableBusinessProfileFields}
              />
            ) : (
              <InvidualProfileForm
                formData={basicProfile?.data}
                nextTab={handleTabChange}
                showNext={showIndividualProfileNextBtn}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value="id-verification" pt="lg">
            <IdVerification />
          </Tabs.Panel>
          {data?.data?.client_type === CLIENT_TYPES.CORPORATE && (
            <Tabs.Panel value="document-upload" pt="lg">
              <DocumentUpload
                formData={documents?.data}
                disableDocumentNextButton={disableBusinessDocumentNextButton()}
                nextTab={setActiveTab}
              />
            </Tabs.Panel>
          )}
          {/* <Tabs.Panel value="gateway-options" pt="lg">
            <GatewayOptions
              userSelectedGateways={userSelectedGateways?.data}
              nextTab={setActiveTab}
            />
          </Tabs.Panel> */}
          <Tabs.Panel value="account-detail" pt="lg">
            <AccountDetailForm
              formData={accountDetails?.data}
              nextTab={setActiveTab}
              disableFields={false}
              banks={bankOptions}
              loadingBanks={isLoadingBanks}
              // gateway={defaultGateway?.gateway}
              showNext={showAccountDetailNextBtn}
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
