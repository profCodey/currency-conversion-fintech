import { z } from "zod";
import { TextInput, Button, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useGetCurrentUser } from "@/api/hooks/user";
import {
    useUpdateBasicProfile,
    useUpdateInvidualProfile,
} from "@/api/hooks/onboarding";
import {
    basicProfileFormValidator,
    invidualProfileFormValidator,
} from "@/utils/validators";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { allCountryNames } from "@/utils/countries";
import { ArrowRight } from "iconsax-react";
import Cookies from "js-cookie";

// interface ProfileValidator {
//   status: string
// }
interface ProfileValidator
    extends z.infer<typeof invidualProfileFormValidator> {
    status: string;
}

export function InvidualProfileForm({
    formData,
    nextTab,
    showNext,
}: {
    formData: ProfileValidator;
    nextTab: (arg0: string) => void;
    showNext: boolean;
}) {
    const { data } = useGetCurrentUser();
    const { mutate: updateProfile, isLoading } = useUpdateInvidualProfile(
        data?.data.id
    );

    // console.log({formData},"individual Prof");

    const invidualProfileForm = useForm({
        initialValues: {
            bvn: formData?.bvn || "",
            city: formData?.city || "",
            state: formData?.state || "",
            country_of_residence: formData?.country_of_residence || "",
            // zip_code: formData?.zip_code || "",
        },
        validate: zodResolver(invidualProfileFormValidator),
    });

    function handleSubmit(data: z.infer<typeof invidualProfileFormValidator>) {
        const payload = {
            ...data,
        };

        // console.log(payload,'individual payload');

        updateProfile(payload);

        // handleNext();
    }

    function handleNext() {
        nextTab("id-verification");
    }
    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";

    return (
        <form
            className="max-w-[850px] flex flex-col flex-wrap gap-5 max-h-[500px]"
            onSubmit={invidualProfileForm.onSubmit(handleSubmit)}>
            <TextInput
                placeholder="State"
                label="State"
                size="lg"
                {...invidualProfileForm.getInputProps("state")}
                classNames={{ input: "disabled:bg-white text-black" }}
                disabled={showNext}
            />

            <TextInput
                placeholder="City"
                label="City"
                size="lg"
                {...invidualProfileForm.getInputProps("city")}
                classNames={{ input: "disabled:bg-white text-black" }}
                disabled={showNext}
            />

            <Select
                data={allCountryNames}
                searchable
                placeholder="Country of Residence"
                label="Country of Residence"
                size="lg"
                {...invidualProfileForm.getInputProps("country_of_residence")}
                classNames={{ input: "disabled:bg-white text-black" }}
                disabled={showNext}
            />

            <TextInput
                placeholder="BVN"
                label="BVN"
                size="lg"
                {...invidualProfileForm.getInputProps("bvn")}
                classNames={{ input: "disabled:bg-white text-black" }}
                disabled={showNext}
            />
            {!showNext ? (
                <Button
                    type="submit"
                    size="lg"
                    style={{ backgroundColor: colorSecondary }}
                    loading={isLoading}>
                    Submit
                </Button>
            ) : (
                <Button
                    type="button"
                    size="lg"
                    style={{ backgroundColor: colorSecondary }}
                    onClick={handleNext}
                    rightIcon={<ArrowRight />}>
                    Next
                </Button>
            )}
        </form>
    );
}
