import { AppLayout } from "@/layout/common/app-layout";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import { ReactElement } from "react";

import { BusinessDetails } from "@/layout/admin/user/business-details";
import { ClientWalletBalances } from "@/layout/admin/user/wallet-balances";
import { Breadcrumbs, Button, Tabs } from "@mantine/core";
import { ClientGateways } from "@/layout/admin/user/gateways";
import { ClientDocuments } from "@/layout/admin/user/documents";
import Transactions from "@/pages/transactions";
import { ClientTransactions } from "@/layout/admin/user/transactions";
import { useRouter } from "next/router";
import { PageHeader } from "@/components/admin/page-header";
export default function UserProfile() {
  const router = useRouter();
  const id = router?.query.id as string;

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
        header={<Breadcrumbs>{items}</Breadcrumbs>}
        meta={
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
        }
      />
      {/* <div className="flex justify-between">
        <Link href="/admin/users" className="flex gap-4">
          <ArrowLeft2 />
          <span>Back</span>
        </Link>
      </div> */}

      <section className="flex gap-6 justify-between relative">
        <BusinessDetails />
        <ClientWalletBalances />
      </section>

      <section className="rounded-md bg-white shadow border flex-grow">
        <Tabs variant="pills" defaultValue="documents">
          <Tabs.List>
            {/* <Tabs.Tab value="transactions">Transactions</Tabs.Tab> */}
            <Tabs.Tab value="documents">Documents</Tabs.Tab>
            <Tabs.Tab value="gateways">Gateways</Tabs.Tab>
          </Tabs.List>

          {/* <Tabs.Panel value="transactions">
            <ClientTransactions />
          </Tabs.Panel> */}
          <Tabs.Panel value="documents">
            <ClientDocuments />
          </Tabs.Panel>
          <Tabs.Panel value="gateways">
            <ClientGateways />
          </Tabs.Panel>
        </Tabs>
      </section>
    </section>
  );
}

UserProfile.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
