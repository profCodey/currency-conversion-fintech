import { useAddNewBank } from "@/api/hooks/admin/banks";
import { Button, Modal, Select, Stack, Switch, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";

export const AddNewBankValidator = z.object({
  name: z.string().min(1, { message: "Enter bank name" }),
  category: z.string().min(1, { message: "Select category" }),
  is_active: z.boolean(),
});

export function AddBankButton() {
  const [createBankModalOpen, setCreateBankModalOpen] = useState(false);
  const { mutate: addNewBank, isLoading: addNewBankLoading } =
    useAddNewBank(closeAddBankModal);
  const addNewBankForm = useForm({
    initialValues: {
      name: "",
      is_active: true,
      category: "local",
    },
    validate: zodResolver(AddNewBankValidator),
  });

  function handleNewBankSubmit(values: z.infer<typeof AddNewBankValidator>) {
    addNewBank(values);
  }

  function closeAddBankModal() {
    setCreateBankModalOpen(false);
    addNewBankForm.reset();
  }

  return (
    <>
      <Button
        className="bg-primary-100 hover:bg-primary-100"
        size="md"
        onClick={() => setCreateBankModalOpen(true)}
      >
        Create Bank
      </Button>

      <Modal
        title="Create new bank"
        opened={createBankModalOpen}
        onClose={closeAddBankModal}
        size="md"
        centered
      >
        <form onSubmit={addNewBankForm.onSubmit(handleNewBankSubmit)}>
          <Stack>
            <TextInput
              label="Bank name"
              placeholder="Enter bank name"
              size="md"
              {...addNewBankForm.getInputProps("name")}
            />
            <Select
              label="Category"
              defaultValue="local"
              disabled
              data={[
                { label: "Foreign", value: "fx" },
                { label: "Local", value: "local" },
              ]}
              size="md"
              {...addNewBankForm.getInputProps("category")}
            />
            <Switch
              label="Activate"
              size="md"
              checked={addNewBankForm.values.is_active}
              {...addNewBankForm.getInputProps("is_active")}
            />
            <Button
              className="bg-primary-100 hover:bg-primary-100"
              size="md"
              type="submit"
              loading={addNewBankLoading}
              loaderPosition="right"
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
