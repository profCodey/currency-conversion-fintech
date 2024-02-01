import { useEffect, useState } from "react";
import { AppLayout } from "@/layout/common/app-layout";
import { ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import { ReactElement } from "react";

import { BusinessDetails } from "@/layout/admin/user/business-details";
import { ClientWalletBalances } from "@/layout/admin/user/wallet-balances";
import {
  Badge,
  Breadcrumbs,
  Button,
  Group,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core";
import { ClientGateways } from "@/layout/admin/user/gateways";
import { ClientDocuments } from "@/layout/admin/user/documents";
import { useRouter } from "next/router";
import { PageHeader } from "@/components/admin/page-header";
import { useApproveClient, useGetClientDetails } from "@/api/hooks/user";
import { useGetUserDetails } from "@/api/hooks/user";
import { useGetWithdrawalAccount } from "@/api/hooks/withdrawal-account";
import CreditDebit from "@/layout/admin/user/creditdebit";

import Cookies from "js-cookie";

let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export default function UserProfile() {
  const router = useRouter();
  const id = router?.query.id as string;
  const { data: userInfo, isLoading: userLoading } = useGetUserDetails(
    Number(router?.query.id) as number
  );

  const { data: withdrawalAcc, isLoading: withdrawalAccLoading } =
    useGetWithdrawalAccount(router?.query.id as string);
    const [userDetails, setUserDetails] = useState(userInfo?.data)
    const [updateUserDetailsOpen, setUpdateUserDetailsOpen] = useState(false);
 
    useEffect(()=> {
      if(userInfo?.data){
        setUserDetails(userInfo?.data)
      }
    }, [userInfo?.data])
  const items = [
    { title: "User details", href: `/admin/users` },
    { title: id, href: `/admin/users/${id}` },
  ].map((item, index) => (
    <Link key={item.href} href={item.href} className="hover:underline">
      {item.title}
    </Link>
  ));
  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header={
          <div className="flex gap-6">
        <Breadcrumbs>{items}</Breadcrumbs>
        <Button
        style={{backgroundColor: colorBackground}}
        className=" hover:bg-primary-100"
        size="md"
        onClick={() => setUpdateUserDetailsOpen(true)}>
        Update Details
    </Button>
    </div>
      }
        meta={
          <Group>
                
            <ClientApprovalStatus />
          
          </Group>
        }
      />

      <section className="flex flex-col lg:flex-row gap-6 justify-between relative z-10">
        <BusinessDetails userInfo={userDetails} updateUserDetailsOpen={updateUserDetailsOpen} setUpdateUserDetailsOpen={setUpdateUserDetailsOpen} />
        <ClientWalletBalances />
      </section>

        <section className="border  shadow py-6">
          <p className="text-center font-bold">Bank Details</p>
          <div className="flex flex-col md:flex-row justify-around">
            <p className="flex md:flex-col lg:flex-row">
              <div className="font-medium">Account Name:</div>{" "}
              <div>{withdrawalAcc?.data.account_name}</div>
            </p>
            <p className="flex md:flex-col lg:flex-row">
              <div className="font-medium">Account Number:</div>{" "}
              <div>{withdrawalAcc?.data.account_number}</div>
            </p>
          </div>
        </section>

     
        <section className="rounded-md bg-white shadow border flex-grow relative">
         <Tabs variant="pills" defaultValue="gateways">
           <Group position="apart">
            {userInfo?.data?.client_type === "individual" ? (
           <Tabs.List>
              <Tabs.Tab value="gateways">Gateways</Tabs.Tab>
              <Tabs.Tab value="credit/debit">Credit/Debit</Tabs.Tab>
                          </Tabs.List>
            ) : (
              <Tabs.List>
              <Tabs.Tab value="documents">Documents</Tabs.Tab>
              <Tabs.Tab value="gateways">Gateways</Tabs.Tab>
              <Tabs.Tab value="credit/debit">Credit/Debit</Tabs.Tab>
            </Tabs.List>
            )}
            <Link href={`/admin/users/${id}/transactions`}>
              <Button
                variant="white"
                className="font-primary flex items-center"
                rightIcon={<ArrowRight2 size={16} />}
                size="md"
              >
                View Transactions
              </Button>
            </Link>
           </Group>
     {   userInfo?.data?.client_type !== "individual" ?  ( 
              <><Tabs.Panel value="documents">
              <ClientDocuments />
            </Tabs.Panel><Tabs.Panel value="gateways">
                <ClientGateways />
              </Tabs.Panel>
              <Tabs.Panel value="credit/debit">
            <CreditDebit />
          </Tabs.Panel>
              </>
            ) :
            (
              <>
              <Tabs.Panel value="gateways">
                <ClientGateways />
                </Tabs.Panel> 
              <Tabs.Panel value="credit/debit">
            <CreditDebit />
          </Tabs.Panel>
            </>
          
            )
            }
          
          </Tabs>
        </section>
    </section>
  );
}

function ClientApprovalStatus() {
  const router = useRouter();
  const userId = router.query.id as string;

  const { data, isLoading } = useGetClientDetails(Number(userId));
  const { mutate: approveClient, isLoading: approveClientLoading } =
    useApproveClient(userId);

  if (isLoading) {
    return <Skeleton height={50} width={200} />;
  }
  const isUserApproved = data?.data.status;

  function handleApprove(){
    approveClient();
    setTimeout(() => {
    window.location.reload();
    }, 2000);
  }
  return (
    <Group>
      {!isUserApproved && (
        <Button
        style={{backgroundColor: colorBackground}}
          size="sm"
          className=""
          loading={approveClientLoading}
          onClick={handleApprove}
        >
          Approve
        </Button>
      )}
      <Badge size="lg" variant="dot" color={isUserApproved ? "green" : "red"}>
        {isUserApproved ? "Approved" : "Not approved"}
      </Badge>
    </Group>
  );
}

UserProfile.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
