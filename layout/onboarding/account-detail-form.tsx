import { z } from "zod";
import {
    accountDetailFormValidator,
    basicProfileFormValidator,
} from "@/utils/validators";
import { useForm, zodResolver } from "@mantine/form";
import { Button, LoadingOverlay, Select, TextInput } from "@mantine/core";
import { ArrowRight } from "iconsax-react";
import {
    useGetAccountDetails,
    usePatchAccountDetails,
    usePostAccountDetails,
} from "@/api/hooks/onboarding";
import { useNameEnquiry, useNewClientNameEnquiry } from "@/api/hooks/banks";
import { useState, useEffect, ChangeEvent } from "react";
import { log } from "console";
import Cookies from "js-cookie";

interface SelectBankType {
    label: string;
    value: string;
}
interface AccountDetailValidator
    extends z.infer<typeof accountDetailFormValidator> {}

export const AccountDetailForm = ({
    formData,
    nextTab,
    disableFields,
    banks,
    loadingBanks,
    showNext,
}: // gateway
{
    formData: AccountDetailValidator & { bank: string };
    nextTab: (arg0: string) => void;
    disableFields: boolean;
    banks: any[];
    loadingBanks: boolean;
    showNext: boolean;
    // gateway: number | undefined;
}) => {
    const { mutate: submitAccountDetails, isLoading: isLoadingPatch } =
        usePatchAccountDetails();
    const { mutate: postAccountDetails, isLoading } = usePostAccountDetails();
    const { data: accountDeets, isLoading: isLoadingDeets } =
        useGetAccountDetails();
    // console.log({ accountDeets: accountDeets?.data });
    let colorPrimary = Cookies.get("primary_color")
        ? Cookies.get("primary_color")
        : "#132144";
    let colorSecondary = Cookies.get("secondary_color")
        ? Cookies.get("secondary_color")
        : "#132144";
    let colorBackground = Cookies.get("background_color")
        ? Cookies.get("background_color")
        : "#132144";

    // console.log({ banks });
    const [defaultBank, setDefaultBank] = useState<SelectBankType>({
        label: "",
        value: "",
    });

    const [accountName, setAccountName] = useState<string>("");

    const [newClientNameEnquiryDetails, setNewClientNameEnquiryDetails] =
        useState<{
            account_number: string;
            bank_id: string;
        } | null>(null);

    const {
        data: newClientNameEnquiryResult,
        refetch,
        isFetching: fetchingNewClientNameEnquiryDetails,
    } = useNewClientNameEnquiry(newClientNameEnquiryDetails);

    const accountDetailForm = useForm({
        initialValues: {
            bank_name:
                formData?.bank_name || accountDeets?.data?.bank_name || "",
            bank: accountDeets?.data?.bank || formData?.bank || "",
            account_name: formData?.account_name || "",
            account_number: formData?.account_number || "",
        },
        validate: zodResolver(accountDetailFormValidator),
    });

    // const b_name = accountDetailForm.getInputProps('bank_name');
    // console.log({b_name});

    const showNextBtn = Boolean(
        (accountDeets?.data?.account_name &&
            accountDeets?.data?.account_number) ||
            (formData?.account_name &&
                formData?.account_number &&
                formData?.bank_name)
    );

    function handleAccountNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const acc_number = e.target.value;
        accountDetailForm.setFieldValue("account_number", acc_number);
        // console.log({banks});

        if (acc_number.toString().length === 10) {
            setNewClientNameEnquiryDetails({
                ...newClientNameEnquiryDetails,
                account_number: acc_number,
                bank_id: accountDetailForm.values?.bank,
            });

            refetch();
        }
    }

    function handleBankName(bank_id: string) {
        accountDetailForm.setFieldValue("bank", bank_id);
        const bank_name = banks.find((b) => b.value === bank_id);

        if (bank_name) {
            accountDetailForm.setFieldValue("bank_name", bank_name?.label);
            setDefaultBank(bank_name.label);
        }
    }

    useEffect(
        function () {
            if (newClientNameEnquiryResult?.data) {
                const name = newClientNameEnquiryResult?.data.result ?? "";
                if (name) {
                    accountDetailForm.setFieldValue("account_name", name);
                } else {
                    accountDetailForm.setFieldValue("account_name", "");
                    accountDetailForm.setFieldError(
                        "account_name",
                        "Name enquiry failed"
                    );
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [newClientNameEnquiryResult?.data]
    );

    useEffect(() => {
        if (formData?.bank && banks?.length > 0) {
            const bankId = formData.bank;
            // console.log({bankId})
            handleBankName(bankId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [banks, formData]);

    useEffect(() => {
        if (accountDeets?.data) {
            const bankId = accountDeets.data.bank;

            handleBankName(bankId);
            const acc_number = accountDeets.data.account_number;
            accountDetailForm.setFieldValue("account_number", acc_number);
            accountDetailForm.setFieldValue(
                "account_name",
                accountDeets.data.account_name
            );
        }
    }, [accountDeets?.data]);

    function handleSubmit(data: z.infer<typeof accountDetailFormValidator>) {
        // submitAccountDetails(data);
        postAccountDetails(data);
    }

    function handleNext() {
        nextTab("status");
    }

    return (
        <form
            className="max-w-[850px] flex flex-col flex-wrap gap-5 max-h-[500px]"
            onSubmit={accountDetailForm.onSubmit(handleSubmit)}>
            <LoadingOverlay
                visible={fetchingNewClientNameEnquiryDetails || loadingBanks}
                overlayBlur={2}
            />
            {accountDeets?.data ? (
                // Render TextInput if accountDeets?.data is available
                <TextInput
                    placeholder="Bank Name"
                    size="lg"
                    value={accountDeets.data.bank_name} // Display bank_name from accountDeets.data
                    disabled={true}
                    classNames={{ input: "disabled:bg-white text-black" }}
                />
            ) : (
                <Select
                    data={banks}
                    placeholder="Bank Name"
                    size="lg"
                    {...accountDetailForm.getInputProps("bank")}
                    // value={defaultBank.label || accountDetailForm.values.bank_name}
                    defaultValue={
                        formData?.bank ||
                        defaultBank?.label ||
                        accountDetailForm.values.bank_name
                    }
                    onChange={(bank_id: string) => {
                        // console.log({ bank_id });
                        handleBankName(bank_id);
                    }}
                    classNames={{ input: "disabled:bg-white text-black" }}
                    disabled={loadingBanks}
                />
            )}
            {accountDeets?.data ? (
                <TextInput
                    placeholder="Account Number"
                    size="lg"
                    defaultValue={accountDeets.data.account_number}
                    classNames={{ input: "disabled:bg-white text-black" }}
                    disabled={true}
                />
            ) : (
                <TextInput
                    placeholder="Account Number"
                    size="lg"
                    // {...accountDetailForm.getInputProps("account_number")}
                    // value={}
                    defaultValue={formData?.account_number || ""}
                    classNames={{ input: "disabled:bg-white text-black" }}
                    // disabled={disableFields}
                    onChange={handleAccountNumberChange}
                />
            )}

            <TextInput
                placeholder="Account Name"
                size="lg"
                // defaultValue={account || ""}
                {...accountDetailForm.getInputProps("account_name")}
                // {...)}
                onChange={(e) => {
                    const name = e.target.value;
                    accountDetailForm.setFieldValue("account_name", name);
                }}
                classNames={{ input: "disabled:bg-white text-black" }}
                disabled={true}
            />

            {!showNext || !showNextBtn ? (
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
                    className="bg-[#00B0F0] hover:bg-[#00B0F0]"
                    onClick={handleNext}
                    rightIcon={<ArrowRight />}>
                    Next
                </Button>
            )}
        </form>
    );
};
