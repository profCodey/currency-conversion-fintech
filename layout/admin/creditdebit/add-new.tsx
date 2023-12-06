import { Button, Modal, Select, Stack, Switch, TextInput } from "@mantine/core";
import { useAddCreditDebit } from "@/api/hooks/admin/creditdebit";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";
import { useGatewayOptions } from "@/api/hooks/gateways";
import { useClientSelectedGatewayOptions } from "@/api/hooks/gateways";
export const AddNewCreditDebitValidator = z.object({
    client_selected_gateway: z.string().min(1, { message: "Select gateway" }),
    amount: z.string().min(1, { message: "Enter amount" }),
    narration: z.string().min(1, { message: "Enter narration" }),
    transaction_type: z.string().min(1, { message: "Select transaction type" }),
});
export function AddCreditDebitButton() {
  const { gatewayOptions, isLoading: gatewaysLoading } = useClientSelectedGatewayOptions();
    const [createCreditDebitModalOpen, setCreateCreditDebitModalOpen] = useState(false);
    const { mutate: addNewCreditDebit, isLoading: addNewCreditDebitLoading } =
        useAddCreditDebit(closeAddCreditDebitModal);
    const addNewCreditDebitForm = useForm({
        initialValues: {
            client_selected_gateway: "",
            amount: "",
            narration: "",
            transaction_type: "credit",
        },
        validate: zodResolver(AddNewCreditDebitValidator),
    });
    function handleNewCreditDebitSubmit(values: z.infer<typeof AddNewCreditDebitValidator>) {
        addNewCreditDebit(values);
    }
    function closeAddCreditDebitModal() {
        setCreateCreditDebitModalOpen(false);
        addNewCreditDebitForm.reset();
    }
    function handleGatewayChange(event: any) {
      addNewCreditDebitForm.setFieldValue("gateway", event.currentTarget.value);
    }
return (
    <>
    <Button
        className="bg-primary-100 hover:bg-primary-100"
        size="md"
        onClick={() => setCreateCreditDebitModalOpen(true)}
      >
        Credit/Debit Client
      </Button>
      <Modal
        title="Create new Credit/Debit action"
        opened={createCreditDebitModalOpen}
        onClose={closeAddCreditDebitModal}
        size="md"
        centered
        >
        <form onSubmit={addNewCreditDebitForm.onSubmit(handleNewCreditDebitSubmit)}>
          <Stack>
            <Select
              label="Gateway"
              data={gatewayOptions}
              placeholder="Select gateway"
              size="md"
              {...addNewCreditDebitForm.getInputProps("client_selected_gateway")}
              // onChange={handleGatewayChange}
            />
             
          
            <TextInput
              label="Amount"
              placeholder="Enter amount"
              size="md"
              {...addNewCreditDebitForm.getInputProps("amount")}
            />
            <TextInput
              label="Narration"
              placeholder="Enter remarks"
              size="md"
              {...addNewCreditDebitForm.getInputProps("narration")}
            />
            <Select
              label="Transaction type"
              placeholder="Select transaction type"
              size="md"
              data={[
                { label: "Credit", value: "credit" },
                { label: "Debit", value: "debit" },
              ]
              }
              {...addNewCreditDebitForm.getInputProps("transaction_type")}
            />
              
            <Button
              type="submit"
              variant="outline"
              color="blue"
              size="md"
              loading={addNewCreditDebitLoading}
            >
              Create
            </Button>
          </Stack>
        </form>
        </Modal>
    </>
)
}