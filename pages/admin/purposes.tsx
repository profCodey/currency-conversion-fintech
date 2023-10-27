import { useGetPurposes, useUpdatePurpose, useDeletePurpose } from "@/api/hooks/admin/purposes";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { PageHeader } from "@/components/admin/page-header";
import { CreatePurposeButton } from "@/layout/admin/purposes/create-purpose-button";
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
import { useCallback, useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useUpdateRate } from "@/api/hooks/admin/rates";
import {
    Button,
    Drawer,
    Group,
    NumberInput,
    Text,
    Switch,
    TextInput,
} from "@mantine/core";

import { IPurpose } from "@/utils/validators/interfaces";
import { closeAllModals, modals } from "@mantine/modals";

export const purposeFormValidator = z.object({
    description: z.string().min(1, "Enter Purpose Description"),
});

export interface UpdatePurposePayload {
    id: number;
   description: string;
}
export default function Purposes() {
    const { data, isLoading: purposesLoading } = useGetPurposes();
    const router = useRouter();
    const [editPurposeModalOpen, setEditPurposeModalOpen] = useState(false);
    const [selectedPurpose, setSelectedPurpose] = useState<IPurpose | null>(null);
    const { mutate: updatePurpose, isLoading: updatePurposeLoading } =
        useUpdatePurpose(closePurposeModal);
    const { mutate: deletePurpose, isLoading: deletePurposeLoading } =
        useDeletePurpose();
   

    const editPurposeForm = useForm({
        initialValues: {
            description: (selectedPurpose as any)?.description
        },

        validate: zodResolver(purposeFormValidator),
    });

    const openDrawer = useCallback((purpose: IPurpose) => {
        setEditPurposeModalOpen(true);
        setSelectedPurpose(purpose);
        if (purpose) {
            editPurposeForm.setFieldValue("description", purpose.description)
        }
    }, []);
    function closePurposeModal() {
        setEditPurposeModalOpen(false);
        setSelectedPurpose(null);
    }

    function handleSubmit(values: z.infer<typeof purposeFormValidator>) {
        if (selectedPurpose) {
            const payload: UpdatePurposePayload = {
                id: selectedPurpose.id,
                description: values.description,
            };
            updatePurpose(payload);
            closePurposeModal();
        }
    }

    function handleDeletePurpose(purpose: IPurpose) {
        modals.openConfirmModal({
            title: "Please confirm the following details",
            children: <Text>Are you sure you want to delete this purpose?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: {
                className: "bg-primary-100",
                loading: deletePurposeLoading,
            },
            onCancel: closeAllModals,
            onConfirm: () => deletePurpose(purpose.id),
        });
    }

    const _rows = useMemo(
        function () {
            return data?.data.map((purpose, idx) => (
                <tr key={purpose.id}>
                    <td>{idx + 1}</td>
                    <td>{purpose.description}</td>                   
                    {/* <td>
                        {dayjs(purpose.created_on).format("MMM D, YYYY h:mm A")}
                    </td> */}
                    <td>
                        <Menu width={150} position="right">
                            <Menu.Target>
                                <ActionIcon className="">
                                    <More className="rotate-90" />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => openDrawer(purpose)}>
                                    Edit
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    onClick={() => handleDeletePurpose(purpose)}>
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </td>
                </tr>
            ));
        },
        [data?.data, openDrawer]
    );

    return (
        <section className="flex flex-col gap-6 h-full relative">
            <PageHeader
                header="List of Purpose of Payment"
                subheader="Manage, Create, Edit, or Delete Purposes of Payment"
                meta={<CreatePurposeButton />}
            />

            <section className="">
                <Table verticalSpacing="md" withBorder>
                    {/* <LoadingOverlay visible={isLoading} /> */}
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Description</th>
                            {/* <th>Created On</th> */}
                            
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{_rows}</tbody>
                    <Drawer
                        title="Edit Purpose"
                        opened={editPurposeModalOpen}
                        onClose={closePurposeModal}
                        size="md"
                        className="relative"
                        position="right">
                        <form
                            onSubmit={editPurposeForm.onSubmit(handleSubmit)}
                            className="relative">
                            <LoadingOverlay visible={updatePurposeLoading} />
                            <Stack>
                                <TextInput
                                    label="Description"
                                    placeholder="Enter description"
                                    type="text"
                                    value={editPurposeForm.values.description}
                                    onChange={(event) => {
                                        const inputValue =
                                            event.currentTarget.value;
                                        editPurposeForm.setFieldValue(
                                            "description",
                                           inputValue
                                        );
                                        editPurposeForm.setFieldValue(
                                            "description",
                                            inputValue
                                        );
                                    }}
                                />

                                <Group grow>
                                    <Button
                                        className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                                        size="md"
                                        type="button"
                                        onClick={closePurposeModal}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-primary-100 hover:bg-primary-100"
                                        size="md"
                                        type="submit" // Change the type to "button
                                        loading={updatePurposeLoading}
                                        onClick={() => {
                                            editPurposeForm.validate();
                                           
                                            handleSubmit(
                                                editPurposeForm.values
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
Purposes.getLayout = function getLayout(page: ReactElement) {
    return <AppLayout>{page}</AppLayout>;
};
