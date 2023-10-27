import { useAddNewPurpose } from "@/api/hooks/admin/purposes";
import {
    Button,
    Group,
    LoadingOverlay,
    Modal,
    Stack,
    Switch,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals, openModal } from "@mantine/modals";
import { Warning2 } from "iconsax-react";
import { useState } from "react";
import { z } from "zod";

export const purposeFormValidator = z.object({
    description: z.string().min(1, "Enter Purpose Description"),
});

export function CreatePurposeButton() {
    const [createPurposeModalOpen, setCreatePurposeModalOpen] = useState(false);
    const { mutate: addPurpose, isLoading: purposeLoading } =
        useAddNewPurpose(closePurposeModal);
    const addPurposeForm = useForm({
        initialValues: {
            description: "",
        },
        validate: zodResolver(purposeFormValidator),
    });

    function closePurposeModal() {
        setCreatePurposeModalOpen(false);
        addPurposeForm.reset();
    }

    function handleSubmit(values: z.infer<typeof purposeFormValidator>) {
        addPurpose(values);
    }

    return (
        <>
            <Button
                className="bg-primary-100 hover:bg-primary-100"
                size="md"
                onClick={() => setCreatePurposeModalOpen(true)}>
                Create new purpose
            </Button>

            <Modal
                title="Create new Purpose"
                opened={createPurposeModalOpen}
                onClose={closePurposeModal}
                size="md"
                centered>
                <form
                    onSubmit={addPurposeForm.onSubmit(handleSubmit)}
                    className="relative">
                    <LoadingOverlay visible={purposeLoading} />
                    <Stack>
                        <TextInput
                            label="Description"
                            placeholder="Enter Purpose Description"
                            type="text"
                            size="md"
                            {...addPurposeForm.getInputProps("description")}
                            onChange={(event) => {
                                const inputValue = event.currentTarget.value;
                                addPurposeForm.setFieldValue(
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
                                type="submit"
                                loading={purposeLoading}
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
