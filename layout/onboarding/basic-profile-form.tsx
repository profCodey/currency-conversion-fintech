import { z } from "zod";
import { TextInput, Button, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useGetCurrentUser } from "@/api/hooks/user";
import {
  useGetBasicProfile,
  useUpdateBasicProfile,
} from "@/api/hooks/onboarding";
import { basicProfileFormValidator } from "@/utils/validators";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { allCountryNames } from "@/utils/countries";

export function BasicProfileForm({
  formData,
}: {
  formData: z.infer<typeof basicProfileFormValidator>;
}) {
  const { data } = useGetCurrentUser();
  const { mutate: updateProfile, isLoading } = useUpdateBasicProfile(
    data?.data.id
  );
  //   const { data: basicProfile, isLoading: basicProfileLoading } =
  //     useGetBasicProfile(data?.data.id);

  //   const profile = formData?.;
  //   console.log(profile);

  const basicProfileForm = useForm({
    initialValues: {
      bvn: formData?.bvn || "",
      city: formData?.city || "",
      state: formData?.state || "",
      zip_code: formData?.zip_code || "",
      tax_number: formData?.tax_number || "",
      business_legal_name: formData?.business_legal_name || "",
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

  return (
    <form
      className="max-w-[850px] flex flex-col flex-wrap gap-5 max-h-[500px]"
      onSubmit={basicProfileForm.onSubmit(handleSubmit)}
    >
      <TextInput
        placeholder="Enter Merchant Legal Name"
        size="lg"
        {...basicProfileForm.getInputProps("business_legal_name")}
      />
      <TextInput
        placeholder="Enter Merchant Trading Name"
        size="lg"
        {...basicProfileForm.getInputProps("business_trading_name")}
      />
      <TextInput
        placeholder="Enter Tax Number"
        size="lg"
        {...basicProfileForm.getInputProps("tax_number")}
      />
      <TextInput
        placeholder="Enter Zip Code"
        size="lg"
        {...basicProfileForm.getInputProps("zip_code")}
      />
      <TextInput
        placeholder="Select State"
        size="lg"
        {...basicProfileForm.getInputProps("state")}
      />
      <TextInput
        placeholder="Select City"
        size="lg"
        {...basicProfileForm.getInputProps("city")}
      />
      <TextInput
        placeholder="Enter Business Registration Number"
        size="lg"
        {...basicProfileForm.getInputProps("business_registration_number")}
      />
      <DateInput
        placeholder="Select Registration Date:"
        size="lg"
        {...basicProfileForm.getInputProps("business_registration_date")}
        maxDate={new Date()}
      />
      <Select
        data={allCountryNames}
        searchable
        placeholder="Country of Business Registration"
        size="lg"
        {...basicProfileForm.getInputProps("country_of_registration")}
      />
      <TextInput
        placeholder="Primary Business Activity"
        size="lg"
        {...basicProfileForm.getInputProps("primary_business_activity")}
      />
      <TextInput
        placeholder="BVN"
        size="lg"
        {...basicProfileForm.getInputProps("bvn")}
      />
      <Button
        type="submit"
        size="lg"
        className="bg-[#00B0F0] hover:bg-[#00B0F0]"
        loading={isLoading}
      >
        Submit
      </Button>
    </form>
  );
}
