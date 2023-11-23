import { useDeleteUserRate, useGetUserRates } from "@/api/hooks/admin/rates";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { PageHeader } from "@/components/admin/page-header";
import { CreateRateButton } from "@/layout/admin/rates/create-rate-button";
import { CreateUserRateButton } from "@/layout/admin/rates/create-user-rate-button";
import { AppLayout } from "@/layout/common/app-layout";
import {
    ActionIcon,
    LoadingOverlay,
    Menu,
    Modal,
    Stack,
    Table,
} from "@mantine/core";
import dayjs from "dayjs";
import { More } from "iconsax-react";
import { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
// import { useGetRate } from "@/api/hooks/admin/rates";
import { useCallback, useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useUpdateUserRate } from "@/api/hooks/admin/rates";
import {
    Button,
    Drawer,
    Group,
    NumberInput,
    Text,
    Switch,
    TextInput,
} from "@mantine/core";

import { IRate } from "@/utils/validators/interfaces";
import { closeAllModals, modals } from "@mantine/modals";
import Cookies from "js-cookie";

let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
export const rateFormValidator = z.object({
    rate: z.number().gt(0, "Enter a value for rate"),
    is_active: z.boolean(),
});

export interface UpdateRatePayload {
    id: number;
    rate: string;
    source_currency: number;
    destination_currency: number;
    is_active: boolean;
}
export default function UserRates() {
    const { getCurrencyNameFromId, isLoading: currencyOptionsLoading } =
        useCurrencyOptions();
    const { data, isLoading: ratesLoading } = useGetUserRates();
    const router = useRouter();
    const [editRateModalOpen, setEditRateModalOpen] = useState(false);
    const [selectedRate, setSelectedRate] = useState<IRate | null>(null);
    const { mutate: updateRate, isLoading: updateRateLoading } =
        useUpdateUserRate(closeRateModal);
    const { mutate: deleteRate, isLoading: deleteRateLoading } =
        useDeleteUserRate();
   

    const editRateForm = useForm({
        initialValues: {
            rate: (selectedRate as any)?.rate,
            is_active: (selectedRate as any)?.is_active,
            source_currency: (selectedRate as any)?.source_currency,
            destination_currency: (selectedRate as any)?.destination_currency,
        },

        validate: zodResolver(rateFormValidator),
    });

    const openDrawer = useCallback((rate: IRate) => {
        setEditRateModalOpen(true);
        setSelectedRate(rate);
        if (rate) {
            editRateForm.setFieldValue("rate", rate.rate);
            editRateForm.setFieldValue("is_active", rate.is_active);
        }
    }, [editRateForm]);
    function closeRateModal() {
        setEditRateModalOpen(false);
        setSelectedRate(null);
    }

    function handleSubmit(values: z.infer<typeof rateFormValidator>) {

        const payload = {
            id: selectedRate?.id as unknown as number,
            rate: values.rate as unknown as string,
            is_active: values.is_active,
            source_currency: selectedRate?.source_currency as unknown as number,
            destination_currency:
                selectedRate?.destination_currency as unknown as number,
        };
        updateRate(payload);
        closeRateModal();
    }

    function handleDeleteRate(rate: IRate) {
        modals.openConfirmModal({
            title: "Please confirm the following details",
            children: <Text>Are you sure you want to delete this rate?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: {
                className: "bg-primary-100",
                loading: deleteRateLoading,
            },
            onCancel: closeAllModals,
            onConfirm: () => deleteRate(rate.id),
        });
    }

    const _rows = useMemo(
        function () {
            return data?.data.map((rate, idx) => (
                <tr key={rate.id}>
                    <td>{idx + 1}</td>
                    <td>{rate.user_email}</td>
                    <td>{rate.rate}</td>
                    <td>{getCurrencyNameFromId(rate.source_currency)}</td>
                    <td>{getCurrencyNameFromId(rate.destination_currency)}</td>
                    <td>
                        {rate.is_active ? (
                            <span className="text-accent font-semibold">
                                Active
                            </span>
                        ) : (
                            <span className="text-gray-90">Inactive</span>
                        )}
                    </td>
                    
                    <td>
                        {dayjs(rate.updated_on).format("MMM D, YYYY h:mm A")}
                    </td>
                    <td>
                        <Menu width={150} position="right">
                            <Menu.Target>
                                <ActionIcon className="">
                                    <More className="rotate-90" />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => openDrawer(rate)}>
                                    Edit
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    onClick={() => handleDeleteRate(rate)}>
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </td>
                </tr>
            ));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data?.data, getCurrencyNameFromId]
    );

    return (
        <section className="flex flex-col gap-6 h-full relative">
            <PageHeader
                header="User Rates"
                subheader="View and set user rates for different currencies"
                meta={<CreateUserRateButton />}
            />

            <section className="">
                <Table verticalSpacing="md" withBorder>
                    {/* <LoadingOverlay visible={isLoading} /> */}
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>User</th>
                            <th>Rate</th>
                            <th>Source currency</th>
                            <th>Destination currency</th>
                            <th>Status</th>
                            <th>Last updated</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{_rows}</tbody>
                    <Drawer
                        title={`Edit rate for user "${selectedRate?.user_email}"`}
                        opened={editRateModalOpen}
                        onClose={closeRateModal}
                        size="md"
                        className="relative"
                        position="right">
                        <form
                            onSubmit={editRateForm.onSubmit(handleSubmit)}
                            className="relative">
                            <LoadingOverlay visible={updateRateLoading} />
                            <Stack>
                                
                                <TextInput
                                    label="Rate"
                                    placeholder="0.00"
                                    type="number"
                                    value={editRateForm.values.rate}
                                    onChange={(event) => {
                                        const inputValue =
                                            event.currentTarget.value;
                                        editRateForm.setFieldValue(
                                            "rate",
                                            parseFloat(inputValue)
                                        );
                                        editRateForm.setFieldValue(
                                            "rate",
                                            inputValue
                                        );
                                    }}
                                />

                                <TextInput
                                    label="Source currency"
                                    placeholder="Select currency"
                                    size="md"
                                    value={getCurrencyNameFromId(
                                        selectedRate?.source_currency as unknown as number
                                    )}
                                    onChange={() => {}}
                                />
                                <TextInput
                                    label="Destination currency"
                                    placeholder="Select currency"
                                    size="md"
                                    value={getCurrencyNameFromId(
                                        selectedRate?.destination_currency as unknown as number
                                    )}
                                    onChange={() => {}}
                                />
                                <Switch
                                    label="Activate rate"
                                    size="md"
                                    checked={editRateForm.values.is_active}
                                    {...editRateForm.getInputProps("is_active")}
                                />
                                  
                                <Group grow>
                                    <Button
                                        className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                                        size="md"
                                        type="button"
                                        onClick={closeRateModal}>
                                        Cancel
                                    </Button>
                                    <Button
                                         style={{backgroundColor: colorBackground}}
                                        className="hover:bg-primary-100"
                                        size="md"
                                        type="submit" // Change the type to "button
                                        loading={updateRateLoading}
                                        onClick={() => {
                                            editRateForm.validate();
                                            handleSubmit(
                                                editRateForm.values
                                            );
                                        }}
                                        loaderPosition="right">
                                        Submit
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Drawer>
                </Table>
            </section>
        </section>
    );
}

UserRates.getLayout = function getLayout(page: ReactElement) {
    return <AppLayout>{page}</AppLayout>;
};
