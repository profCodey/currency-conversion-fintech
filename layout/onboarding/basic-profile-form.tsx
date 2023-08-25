import { z } from "zod";
import { TextInput, Button, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useGetCurrentUser } from "@/api/hooks/user";
import { useUpdateBasicProfile } from "@/api/hooks/onboarding";
import { basicProfileFormValidator } from "@/utils/validators";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { allCountryNames } from "@/utils/countries";
import { ArrowRight } from "iconsax-react";

// interface ProfileValidator {
//   status: string
// }
interface ProfileValidator extends z.infer<typeof basicProfileFormValidator> {
  status: string;
}

export function BasicProfileForm({
  formData,
  nextTab,
  disableFields,
}: {
  formData: ProfileValidator;
  nextTab: (arg0: string) => void;
  disableFields: boolean;
}) {
  const { data } = useGetCurrentUser();
  const { mutate: updateProfile, isLoading } = useUpdateBasicProfile(
    data?.data.id
  );

  const basicProfileForm = useForm({
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
    validate: zodResolver(basicProfileFormValidator),
  });

  function handleSubmit(data: z.infer<typeof basicProfileFormValidator>) {
    const payload = {
      ...data,
      business_registration_date: dayjs(data.business_registration_date).format(
        "YYYY-MM-DD"
      ),
    };
    updateProfile(payload);
  }

  function handleNext() {
    nextTab("id-verification");
  }

  return (
    <form
      className="max-w-[850px] flex flex-col flex-wrap gap-5 max-h-[500px]"
      onSubmit={basicProfileForm.onSubmit(handleSubmit)}
    >
      <TextInput
        placeholder="Enter Merchant Legal Name"
        size="lg"
        classNames={{
          input: "disabled:bg-white text-black",
        }}
        disabled={disableFields}
        {...basicProfileForm.getInputProps("business_legal_name")}
        onChange={(e) => {
          basicProfileForm.setFieldValue("business_legal_name", e.target.value);
          basicProfileForm.setFieldValue(
            "business_code",
            e.target.value.toLowerCase()
          );
        }}
      />
      <TextInput
        placeholder="Enter Merchant Trading Name"
        size="lg"
        {...basicProfileForm.getInputProps("business_trading_name")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Enter Tax Number (optional)"
        size="lg"
        {...basicProfileForm.getInputProps("tax_number")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Enter Business Code"
        size="lg"
        {...basicProfileForm.getInputProps("business_code")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
        onChange={(e) =>
          basicProfileForm.setFieldValue(
            "business_code",
            e.target.value.toLocaleLowerCase()
          )
        }
      />
      <TextInput
        placeholder="Enter Zip Code"
        size="lg"
        {...basicProfileForm.getInputProps("zip_code")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Select State"
        size="lg"
        {...basicProfileForm.getInputProps("state")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Select City"
        size="lg"
        {...basicProfileForm.getInputProps("city")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Enter Business Registration Number"
        size="lg"
        {...basicProfileForm.getInputProps("business_registration_number")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <DateInput
        placeholder="Select Registration Date:"
        size="lg"
        {...basicProfileForm.getInputProps("business_registration_date")}
        classNames={{ input: "disabled:bg-white text-black" }}
        maxDate={new Date()}
        disabled={disableFields}
      />
      <Select
        data={allCountryNames}
        searchable
        placeholder="Country of Business Registration"
        size="lg"
        {...basicProfileForm.getInputProps("country_of_registration")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="Primary Business Activity"
        size="lg"
        {...basicProfileForm.getInputProps("primary_business_activity")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      <TextInput
        placeholder="BVN"
        size="lg"
        {...basicProfileForm.getInputProps("bvn")}
        classNames={{ input: "disabled:bg-white text-black" }}
        disabled={disableFields}
      />
      {!disableFields ? (
        <Button
          type="submit"
          size="lg"
          className="bg-[#00B0F0] hover:bg-[#00B0F0]"
          loading={isLoading}
        >
          Submit
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          className="bg-[#00B0F0] hover:bg-[#00B0F0]"
          onClick={handleNext}
          rightIcon={<ArrowRight />}
        >
          Next
        </Button>
      )}
    </form>
  );
}
