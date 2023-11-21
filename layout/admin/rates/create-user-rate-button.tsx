import { useAddNewUserRate } from "@/api/hooks/admin/rates";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { useUsersList } from "@/api/hooks/admin/users";
import {
    Button,
    Group,
    LoadingOverlay,
    Modal,
    NumberInput,
    Select,
    Stack,
    Switch,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals, openModal } from "@mantine/modals";
import { Warning2 } from "iconsax-react";
import { useState, useMemo } from "react";
import { z } from "zod";

export const rateFormValidator = z.object({
    user: z.string().min(1, "Select a user"),
    rate: z.number().gt(0, "Enter a value for rate"),
    is_active: z.boolean(),
    source_currency: z.string().min(1, "Select source currency"),
    destination_currency: z.string().min(1, "Select destination currency"),
});

export function CreateUserRateButton() {
    const [createRateModalOpen, setCreateRateModalOpen] = useState(false);
    const { mutate: addRate, isLoading: rateLoading } =
        useAddNewUserRate(closeRateModal);
    const { currencyOptionsWithId, isLoading } = useCurrencyOptions();
    const { data: usersList, isLoading: usersLoading } = useUsersList();

    const userOptions: { value: string; label: string }[] = useMemo(() => {
        const options =
            usersList?.data?.map((user) => ({
                value: user.id.toString(),
                label: `${user.first_name} ${user.last_name} (${user.email})`,
            })) || [];

        // Add the extra object to index 0
        options.unshift({ value: "0", label: "Select User" });

        return options;
    }, [usersList?.data]);

    const addRateForm = useForm({
        initialValues: {
            rate: 0.0,
            is_active: false,
            source_currency: "",
            destination_currency: "",
            user: "",
        },
        validate: zodResolver(rateFormValidator),
    });

    function closeRateModal() {
        setCreateRateModalOpen(false);
        addRateForm.reset();
    }

    function handleSubmit(values: z.infer<typeof rateFormValidator>) {
        if (values.destination_currency === values.source_currency) {
            return addRateForm.setFieldError(
                "destination_currency",
                "Destination currency cannot be same as source"
            );
        }
       
        addRate(values);
    }

    return (
        <>
            <Button
                className="bg-primary-100 hover:bg-primary-100"
                size="md"
                onClick={() => setCreateRateModalOpen(true)}>
                Create Rate
            </Button>

            <Modal
                title="Create new rate"
                opened={createRateModalOpen}
                onClose={closeRateModal}
                size="md"
                centered>
                <form
                    onSubmit={addRateForm.onSubmit(handleSubmit)}
                    className="relative">
                    <LoadingOverlay visible={isLoading} />
                    <Stack>
                        <Select
                            label="Users"
                            placeholder="Select User"
                            data={userOptions}
                            {...addRateForm.getInputProps("user")}
                        />
                        <TextInput
                            label="Rate"
                            placeholder="0.00"
                            type="number"
                            {...addRateForm.getInputProps("rate")}
                            onChange={(event) => {
                                const inputValue = event.currentTarget.value;
                                addRateForm.setFieldValue(
                                    "rate",
                                    parseFloat(inputValue)
                                );
                            }}
                        />

                        <Select
                            label="Source currency"
                            placeholder="Select currency"
                            data={currencyOptionsWithId}
                            size="md"
                            {...addRateForm.getInputProps("source_currency")}
                        />
                        <Select
                            label="Destination currency"
                            placeholder="Select currency"
                            data={currencyOptionsWithId}
                            size="md"
                            {...addRateForm.getInputProps(
                                "destination_currency"
                            )}
                        />
                        <div className="flex">
                            <Switch
                                className="w-1/2"
                                label="Activate rate"
                                size="md"
                                checked={addRateForm.values.is_active}
                                {...addRateForm.getInputProps("is_active")}
                            />
                        </div>
                        <Group grow>
                            <Button
                                className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                                size="md"
                                type="button"
                                onClick={closeRateModal}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-primary-100 hover:bg-primary-100"
                                size="md"
                                type="submit"
                                loading={rateLoading}
                                loaderPosition="right">
                                Submit
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}
