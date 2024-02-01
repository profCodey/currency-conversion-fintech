import React, { useState, useEffect } from "react";
import {
  Skeleton,
  Stack,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
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
  setUpdateUserDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserDetailsOpen: boolean;
}
import { z } from "zod";
import { businessProfileFormValidator } from "@/utils/validators";
import { useUpdateBusinessProfile } from "@/api/hooks/onboarding";
import { allCountryNames } from "@/utils/countries";
import Cookies from "js-cookie";

let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export const updateUserDetailsValidator = z.object({
  rate: z.number().gt(0, "Enter a value for rate"),
  is_active: z.boolean(),
  source_currency: z.string().min(1, "Select source currency"),
  destination_currency: z.string().min(1, "Select destination currency"),
  use_live_rate: z.boolean(),
});

export function BusinessDetails({
  userInfo,
  updateUserDetailsOpen,
  setUpdateUserDetailsOpen,
}: BusinessDetailsProps) {
  const router = useRouter();

  const { data: clientProfileDetails, isLoading:clientProfileLoading, isFetching:clientProfileIsFetching} = useClientProfileDetails(
    router?.query.id as string
  );
  const { data: clientDocuments, isLoading: clientDocumentsLoading, isFetching:clientDocumentIsFetching} =
    useClientDocuments(router?.query.id as string);
  const { mutate: updateProfile, isLoading: businessLoading } =
    useUpdateBusinessProfile(Number(router?.query.id));

  const businessProfileForm = useForm({
    initialValues: {
      bvn: clientProfileDetails?.data.bvn ?? "",
      city: clientProfileDetails?.data.city ?? "",
      state: clientProfileDetails?.data.state ?? "",
      zip_code: clientProfileDetails?.data.zip_code ?? "",
      tax_number: clientProfileDetails?.data.tax_number ?? "",
      business_legal_name: clientProfileDetails?.data.business_legal_name ?? "",
      business_code: clientProfileDetails?.data.business_code ?? "",
      business_trading_name:
        clientProfileDetails?.data.business_trading_name ?? "",
      country_of_registration:
        clientProfileDetails?.data.country_of_registration ?? "",
      primary_business_activity:
        clientProfileDetails?.data.primary_business_activity ?? "",
      business_registration_date: clientProfileDetails?.data
        .business_registration_date
        ? new Date(clientProfileDetails?.data.business_registration_date)
        : null,
      business_registration_number:
        clientProfileDetails?.data.business_registration_number ?? "",
    },
    validate: zodResolver(businessProfileFormValidator),
  });


  useEffect(() => {
    if (clientProfileDetails?.data) {
      businessProfileForm.setValues({
        bvn: clientProfileDetails?.data.bvn ?? "",
        city: clientProfileDetails?.data.city ?? "",
        state: clientProfileDetails?.data.state ?? "",
        zip_code: clientProfileDetails?.data.zip_code ?? "",
        tax_number: clientProfileDetails?.data.tax_number ?? "",
        business_legal_name: clientProfileDetails?.data.business_legal_name ?? "",
        business_code: clientProfileDetails?.data.business_code ?? "",
        business_trading_name:
          clientProfileDetails?.data.business_trading_name ?? "",
        country_of_registration:
          clientProfileDetails?.data.country_of_registration ?? "",
        primary_business_activity:
          clientProfileDetails?.data.primary_business_activity ?? "",
        business_registration_date: clientProfileDetails?.data
          .business_registration_date
          ? new Date(clientProfileDetails?.data.business_registration_date)
          : null,
        business_registration_number:
          clientProfileDetails?.data.business_registration_number ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientProfileDetails?.data]);


  function handleSubmit() {
//@ts-ignore
    updateProfile(businessProfileForm.values);
    closeRateModal()
    setTimeout(()=> {
      window.location.reload()
    }, 2000)
  }

  function closeRateModal() {
    setUpdateUserDetailsOpen(false);
  }

  return (
    <Skeleton visible={clientProfileLoading || clientDocumentsLoading || clientDocumentIsFetching || clientProfileIsFetching } className="flex-grow mr-auto">
      <section className="p-6 h-full bg-white shadow flex gap-8 flex-grow mr-auto items-center rounded-md">
        {/* {userInfo?.client_type !== "individual" &&
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
          ))} */}

        {userInfo?.client_type !== "individual" ? (
          <Stack spacing="xs" className="flex-grow">
            <BusinessDetail
              title="Business name"
              content={clientProfileDetails?.data.business_legal_name}
            />
            <BusinessDetail
              title="Account Type"
              content={userInfo?.client_type}
            />
            <BusinessDetail title="Email" content={userInfo?.email} />
            <BusinessDetail
              title="Contact Number"
              content={userInfo?.phone_number}
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
              title="Full Name"
              content={userInfo.first_name + " " + userInfo.last_name}
            />
            <BusinessDetail
              title="Account Type"
              content={userInfo.client_type}
            />
            <BusinessDetail title="Email" content={userInfo.email} />
            <BusinessDetail
              title="Phone Number"
              content={userInfo.phone_number}
            />
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
      <Modal
        title="Update User Details"
        opened={updateUserDetailsOpen}
        onClose={closeRateModal}
        size="md"
        centered
      >
        <form
         onSubmit={businessProfileForm.onSubmit(handleSubmit)}
          className="max-w-[850px] flex flex-col flex-wrap gap-3.5 max-h-[600px] overflow-y-scroll"
        >
          <Stack>
          {userInfo?.client_type !== "individual" ? (
            <>
              <TextInput
                placeholder="Enter Merchant Legal Name"
                label="Merchant Legal Name"
                size="lg"
                {...businessProfileForm.getInputProps("business_legal_name")}
                classNames={{
                  input: "disabled:bg-white text-black",
                }}
                onChange={(e) => {
                  const code = e.target.value.replace(/ /g, "");
                  businessProfileForm.setFieldValue("business_code", code);

                  businessProfileForm.setFieldValue(
                    "business_legal_name",
                    e.target.value
                  );

                  // console.log({code});
                }}
              />
              <TextInput
                placeholder="Enter Merchant Trading Name"
                label="Enter Merchant Trading Name"
                size="lg"
                {...businessProfileForm.getInputProps("business_trading_name")}
                classNames={{ input: "disabled:bg-white text-black" }}
                value={businessProfileForm.values.business_trading_name}
              />
              <TextInput
                placeholder="Enter Tax Number (optional)"
                label="Tax Number (optional)"
                size="lg"
                {...businessProfileForm.getInputProps("tax_number")}
                classNames={{ input: "disabled:bg-white text-black" }}
              />
              <Select
                data={allCountryNames}
                searchable
                placeholder="Select Country of Business Registration"
                label="Country of Business Registration"
                size="lg"
                {...businessProfileForm.getInputProps(
                  "country_of_registration"
                )}
                classNames={{ input: "disabled:bg-white text-black" }}
              />
              <TextInput
                placeholder="Primary Business Activity"
                label="Primary Business Activity"
                size="lg"
                {...businessProfileForm.getInputProps(
                  "primary_business_activity"
                )}
                classNames={{ input: "disabled:bg-white text-black" }}
              />
            </>
          ) : (
            <>
              <TextInput
                placeholder="Select State"
                label="State"
                size="lg"
                {...businessProfileForm.getInputProps("state")}
                classNames={{ input: "disabled:bg-white text-black" }}
              />
              <TextInput
                placeholder="Select City"
                label="City"
                size="lg"
                {...businessProfileForm.getInputProps("city")}
                classNames={{ input: "disabled:bg-white text-black" }}
              />
              <Select
                data={allCountryNames}
                searchable
                placeholder="Select Country of Business Registration"
                label="Country of Business Registration"
                size="lg"
                {...businessProfileForm.getInputProps(
                  "country_of_registration"
                )}
                classNames={{ input: "disabled:bg-white text-black" }}
              />
              <TextInput
                placeholder="BVN"
                label="BVN"
                size="lg"
                value={businessProfileForm.values.bvn}
                onChange={(event) => {
                  const bvn = event.currentTarget.value;
                  businessProfileForm.setFieldValue("bvn", bvn);
                }}
              />
            </>
          )}
          <Group grow>
            <Button
              className="bg-gray-30 hover:bg-gray-30 text-gray-90"
              size="md"
              type="button"
              onClick={closeRateModal}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: colorBackground }}
              className="hover:bg-primary-100"
              size="md"
              type="submit"
              loaderPosition="right"
              loading={businessLoading}
              //@ts-ignore
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Group>
          </Stack>
        </form>
      </Modal>
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
