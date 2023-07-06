import { PageHeader } from "@/components/admin/page-header";
import { ClientTransactions } from "@/layout/admin/user/transactions";
import { AppLayout } from "@/layout/common/app-layout";
import { Breadcrumbs } from "@mantine/core";
import { ArrowLeft2 } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Transactions() {
  const router = useRouter();
  const id = router?.query.id as string;

  const items = [
    { title: "Users", href: `/admin/users` },
    { title: id, href: `/admin/users/${id}` },
    { title: "Transactions", href: "#" },
  ].map((item, index) => (
    <Link key={item.href} href={item.href} className="hover:underline">
      {item.title}
    </Link>
  ));

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header={<Breadcrumbs>{items}</Breadcrumbs>}
        // subheader="View Transaction history for this user"
      />

      <ClientTransactions />
    </section>
  );
}

Transactions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
