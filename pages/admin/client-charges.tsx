import { PageHeader } from "@/components/admin/page-header";
import { CreateClientChargeButton } from "@/layout/admin/client-charges/create-charges-button";
import { AppLayout } from "@/layout/common/app-layout";
import {
    ActionIcon,
    LoadingOverlay,
    Menu,
    Stack,
    Table,
} from "@mantine/core";
import { More } from "iconsax-react";
import { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
    Button,
    Drawer,
    Group,
    TextInput,
} from "@mantine/core";

import { IClientCharges } from "@/utils/validators/interfaces";
import Cookies from "js-cookie";
import { useGetClientCharges, useUpdateClientCharge } from "@/api/hooks/admin/client-charges";

let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

export const clientChargeFormValidator = z.object({
    amount: z.string().min(1, "Enter a value for amount"),
});

export interface UpdatePurposePayload {
    id: number;
   amount: string;
}
export default function Purposes() {

    const { data: clientCharges, isLoading: clientChargesLoading } = useGetClientCharges();
    const router = useRouter();
    const [editClientChargeModalOpen, setEditClientChargeModalOpen] = useState(false);
    const [selectedClientCharge, setSelectedClientCharge] = useState<IClientCharges | null>(null);
    const { mutate: updateClientCharge, isLoading: updateClientChargeLoading } =
    useUpdateClientCharge(closeClientChargeModal);

    const editClientChargeForm = useForm({
        initialValues: {
            amount: (selectedClientCharge as any)?.description
        },

        validate: zodResolver(clientChargeFormValidator),
    });

    const openDrawer = useCallback((clientCharge: IClientCharges) => {
        setEditClientChargeModalOpen(true);
        setSelectedClientCharge(clientCharge);
        if (clientCharge) {
            editClientChargeForm.setFieldValue("amount", clientCharge.amount)
        }
    }, [editClientChargeForm]);
    function closeClientChargeModal() {
        setEditClientChargeModalOpen(false);
        setSelectedClientCharge(null);
    }

    function handleSubmit(values: z.infer<typeof clientChargeFormValidator>) {
        if (selectedClientCharge) {
            const payload: UpdatePurposePayload = {
                id: selectedClientCharge.id,
                amount: values.amount,
            };

            //@ts-ignore
            updateClientCharge(payload);
            closeClientChargeModal();
        }
    }

    const _rows = useMemo(
        function () {
            return clientCharges?.data.map((clientCharges: IClientCharges, idx: number) => (
                <tr key={clientCharges.id}>
                    <td>{idx + 1}</td>
                    <td>{clientCharges.client_name}</td>  
                    <td>{clientCharges.amount}</td>    
                    <td>{clientCharges.source_account_name}</td>   
                    <td>{clientCharges.destination_account_name}</td>                   
                    <td>
                        <Menu width={150} position="right">
                            <Menu.Target>
                                <ActionIcon className="">
                                    <More className="rotate-90" />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => openDrawer(clientCharges)}>
                                    Edit
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </td>
                </tr>
            ));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [clientCharges?.data, openDrawer]
    );

    return (
        <section className="flex flex-col gap-6 h-full relative">
            <PageHeader
                header="List of Client Charges"
                subheader="View, Add, and Update Client Charges"
                meta={<CreateClientChargeButton />}
            />

            <section className="">
                <Table verticalSpacing="md" withBorder>
                    <LoadingOverlay visible={clientChargesLoading} />
                    <thead>
                        <tr>
                            <th>S/N</th>                           
                            <th>Client Name</th>
                            <th>Amount</th>
                            <th>Source Account Name</th>
                            <th>Destination Account Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{_rows}</tbody>
                    <Drawer
                        title="Edit Client Charge"
                        opened={editClientChargeModalOpen}
                        onClose={closeClientChargeModal}
                        size="md"
                        className="relative"
                        position="right">
                        <form
                            onSubmit={editClientChargeForm.onSubmit(handleSubmit)}
                            className="relative">
                            <LoadingOverlay visible={updateClientChargeLoading} />
                            <Stack>
                                <TextInput
                                    label="Amount"
                                    placeholder="Enter amount"
                                    type="text"
                                    value={editClientChargeForm.values.amount}
                                    onChange={(event) => {
                                        const inputValue =
                                            event.currentTarget.value;
                                        editClientChargeForm.setFieldValue(
                                            "amount",
                                           inputValue
                                        );
                                        editClientChargeForm.setFieldValue(
                                            "amount",
                                            inputValue
                                        );
                                    }}
                                />

                                <Group grow>
                                    <Button
                                        className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                                        size="md"
                                        type="button"
                                        onClick={closeClientChargeModal}>
                                        Cancel
                                    </Button>
                                    <Button
                                        style={{backgroundColor: colorBackground}}
                                        className="hover:bg-primary-100"
                                        size="md"
                                        type="submit" // Change the type to "button
                                        loading={updateClientChargeLoading}
                                        onClick={() => {
                                            editClientChargeForm.validate();
                                           
                                            handleSubmit(
                                                editClientChargeForm.values
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
