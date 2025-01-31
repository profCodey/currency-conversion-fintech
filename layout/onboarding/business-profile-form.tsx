import { z } from "zod";
import { TextInput, Button, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useGetCurrentUser } from "@/api/hooks/user";
import { useUpdateBusinessProfile } from "@/api/hooks/onboarding";
import { businessProfileFormValidator } from "@/utils/validators";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { allCountryNames } from "@/utils/countries";
import { ArrowRight } from "iconsax-react";
import Cookies from "js-cookie";
import { useState } from "react";

// interface ProfileValidator {
//   status: string
// }
interface ProfileValidator
  extends z.infer<typeof businessProfileFormValidator> {
  status: string;
}

export function BusinessProfileForm({
  formData,
  nextTab,
  disableFields,
}: {
  formData: ProfileValidator;
  nextTab: (arg0: string) => void;
  disableFields: boolean;
}) {
  const { data } = useGetCurrentUser();
  const { mutate: updateProfile, isLoading } = useUpdateBusinessProfile(
    data?.data.id
  );
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";


  const businessProfileForm = useForm({
    initialValues: {
      bvn: formData?.bvn || "",
      city: formData?.city || "",
      state: formData?.state || "",
      zip_code: formData?.zip_code || "",
      tax_number: formData?.tax_number || "",
      business_legal_name: formData?.business_legal_name || "",
      business_code: formData?.business_code || "",
      business_trading_name: formData?.business_trading_name || "",
      country_of_registration: formData?.country_of_registration || "",
      primary_business_activity: formData?.primary_business_activity || "",
      business_registration_date: formData?.business_registration_date
        ? new Date(formData?.business_registration_date)
        : null,
      business_registration_number:
        formData?.business_registration_number || "",
    },
    validate: zodResolver(businessProfileFormValidator),
  });

  function handleSubmit(data: z.infer<typeof businessProfileFormValidator>) {
    let payload;
    console.log("data", data);
    
   if (businessProfileForm.values.business_registration_date){
      payload = {
      ...data,
      business_registration_date: dayjs(data.business_registration_date).format(
        "YYYY-MM-DD"),
        business_code: data.business_legal_name,
    };
    updateProfile(payload);
  } else {
    payload = {
      ...data,
      business_code: data.business_legal_name,
    };
    updateProfile(data)
  };
}


  function handleNext() {
    nextTab("id-verification");
  }



  return (
    <form
      className="max-w-[850px] flex flex-col flex-wrap gap-3.5 max-h-[600px] overflow-y-scroll"
      onSubmit={businessProfileForm.onSubmit(handleSubmit)}
    >
      <TextInput
        placeholder="Enter Merchant Legal Name"
        label="Merchant Legal Name"
        size="lg"
        required
        classNames={{
          input: "disabled:bg-white text-black",
        }}
        disabled={disableFields}
        {...businessProfileForm.getInputProps("business_legal_name")}
        // onChange={(e) => {
        //   const code = e.target.value.replace(/ /g, "");
        //   businessProfileForm.setFieldValue("business_code", code);

        //   businessProfileForm.setFieldValue(
        //     "business_legal_name",
        //     e.target.value
        //   );

        //   // console.log({code});
        // }}
      />
      <TextInput
        placeholder="Enter Merchant Trading Name"
        label="Enter Merchant Trading Name"
        size="lg"
        {...businessProfileForm.getInputProps("business_trading_name")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Enter Tax Number"
        label="Tax Number (optional)"
        size="lg"
        {...businessProfileForm.getInputProps("tax_number")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      {/* <TextInput
        placeholder="Enter Business Code"
        label="Enter Business Code"
        size="lg"
        {...businessProfileForm.getInputProps("business_code")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
        hidden
   
         
        }
      /> */}
      <TextInput
        placeholder="Enter Zip Code"
        label="Zip Code"
        size="lg"
        required
        {...businessProfileForm.getInputProps("zip_code")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Select State"
        label="State"
        size="lg"
        {...businessProfileForm.getInputProps("state")}
        classNames={{ input: "disabled:bg-white text-black" }}
        required
        disabled={disableFields}
      />
      <TextInput
        placeholder="Select City"
        label="City"
        size="lg"
        {...businessProfileForm.getInputProps("city")}
        classNames={{ input: "disabled:bg-white text-black" }}
        required
        disabled={disableFields}
      />
      <TextInput
        placeholder="Enter Business Registration Number"
        label="Business Registration Number"
        size="lg"
        required
        {...businessProfileForm.getInputProps("business_registration_number")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <DateInput
        placeholder="Select Registration Date:"
        label="Registration Date:"
        size="lg"
        {...businessProfileForm.getInputProps("business_registration_date")}
        classNames={{ input: "disabled:bg-white text-black" }}
        maxDate={new Date()}
        disabled={disableFields}
      />
      <Select
        data={allCountryNames}
        searchable
        required
        placeholder="Select Country of Business Registration"
        label="Country of Business Registration"
        size="lg"
        {...businessProfileForm.getInputProps("country_of_registration")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Primary Business Activity"
        label="Primary Business Activity"
        size="lg"
        required
        {...businessProfileForm.getInputProps("primary_business_activity")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="BVN"
        label="BVN"
        size="lg"
        maxLength={11} 
        required
        {...businessProfileForm.getInputProps("bvn")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      {!disableFields ? (
        <Button
          type="submit"
          size="lg"
          style={{ backgroundColor: colorSecondary}}
          loading={isLoading}
        >
          Submit
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          style={{ backgroundColor: colorSecondary}}
          onClick={handleNext}
          rightIcon={<ArrowRight />}
        >
          Next
        </Button>
      )}
    </form>
  );
}
