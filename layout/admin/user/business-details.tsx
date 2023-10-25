import React, { useState } from "react";
import { Skeleton, Stack } from "@mantine/core";
import PaycelerLogo from "@/public/payceler-logo.svg";
import {
  useClientDocuments,
  useClientProfileDetails,
} from "@/api/hooks/admin/users";
import { useRouter } from "next/router";
import Image from "next/image";
import { IUserDetail } from "@/utils/validators/interfaces";
import { EyeOpenIcon, EyeClosedIcon } from "@/components/icons";
interface BusinessDetailsProps {
  userInfo: IUserDetail | undefined;
}

export function BusinessDetails({ userInfo }: BusinessDetailsProps) {
  const router = useRouter();

  const { data: clientProfileDetails, isLoading } = useClientProfileDetails(
    router?.query.id as string
  );
  const { data: clientDocuments, isLoading: clientDocumentsLoading } =
    useClientDocuments(router?.query.id as string);

  return (
    <Skeleton visible={isLoading} className="flex-grow mr-auto">
      <section className="p-6 h-full bg-white shadow flex gap-8 flex-grow mr-auto items-center rounded-md">
        {userInfo?.client_type !== "individual" &&
          (clientDocuments?.data.logo ? (
            <div className="w-fit">
              <Image
                src={clientDocuments?.data.logo}
                alt=""
                width={250}
                height={250}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          ) : (
            <div className="px-[50px] py-[45px] bg-primary-100 rounded-md">
              <PaycelerLogo />
            </div>
          ))}

        {userInfo?.client_type !== "individual" ? (
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
          </Stack>
        ) : (
          <Stack spacing="xs" className="flex-grow">
            <BusinessDetail
              title="Country of registration"
              content={clientProfileDetails?.data.country_of_registration}
            />
            <BusinessDetail
              title="State"
              content={clientProfileDetails?.data.state}
            />
            <BusinessDetail
              title="City"
              content={clientProfileDetails?.data.city}
            />
            <BusinessDetail
              disclosure={true}
              title="BVN"
              content={clientProfileDetails?.data.bvn}
            />
          </Stack>
        )}
      </section>
    </Skeleton>
  );
}

function BusinessDetail({
  title,
  content,
  disclosure = false,
}: {
  title: string;
  content: string | undefined;
  disclosure?: boolean;
}) {
  const [seeBalance, setSeeBalance] = useState(false);
  return (
    <div className="flex">
      <span className="font-semibold w-[200px] font-secondary">{title}:</span>
      <span>{title == "BVN" && !seeBalance ? "***********" : content}</span>
      {title == "BVN" && (
        <span className="ml-4" onClick={() => setSeeBalance(!seeBalance)}>
          {seeBalance ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </span>
      )}
    </div>
  );
}
