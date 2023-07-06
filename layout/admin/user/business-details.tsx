import { Skeleton, Stack } from "@mantine/core";
import PaycelerLogo from "@/public/payceler-logo.svg";
import { useClientProfileDetails } from "@/api/hooks/admin/users";
import { useRouter } from "next/router";

export function BusinessDetails() {
  const router = useRouter();

  const { data: clientProfileDetails, isLoading } = useClientProfileDetails(
    router?.query.id as string
  );
  return (
    <Skeleton visible={isLoading} className="flex-grow mr-auto">
      <section className="p-6 h-full bg-white shadow flex gap-8 flex-grow mr-auto items-center rounded-md border">
        <div className="px-[50px] py-[45px] bg-primary-100 rounded-md">
          <PaycelerLogo />
        </div>
        <Stack spacing="xs" className="flex-grow">
          <BusinessDetail
            title="Business name"
            content={clientProfileDetails?.data.business_legal_name}
          />
          <BusinessDetail
            title="Registration number"
            content={clientProfileDetails?.data.business_registration_number}
          />
          <BusinessDetail
            title="Trading name"
            content={clientProfileDetails?.data.business_trading_name}
          />
          <BusinessDetail
            title="Primary Activity"
            content={clientProfileDetails?.data.primary_business_activity}
          />
          <BusinessDetail
            title="Tax number"
            content={clientProfileDetails?.data.tax_number}
          />
          <BusinessDetail
            title="Zip code"
            content={clientProfileDetails?.data.zip_code}
          />
          <BusinessDetail
            title="Registration date"
            content={clientProfileDetails?.data.business_registration_date}
          />
        </Stack>
      </section>
    </Skeleton>
  );
}

function BusinessDetail({
  title,
  content,
}: {
  title: string;
  content: string | undefined;
}) {
  return (
    <div className="flex">
      <span className="font-semibold w-[200px] font-secondary">{title}:</span>
      <span>{content}</span>
    </div>
  );
}
