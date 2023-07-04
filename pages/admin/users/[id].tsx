import { AppLayout } from "@/layout/common/app-layout";
import { ArrowLeft2 } from "iconsax-react";
import Link from "next/link";
import { ReactElement } from "react";

export default function UserProfile() {
  return (
    <section>
      <div>
        <Link href="/admin/users" className="flex gap-4">
          <ArrowLeft2 />
          <span>Back</span>
        </Link>
      </div>
    </section>
  );
}

UserProfile.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
