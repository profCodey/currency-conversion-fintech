import { useEditGateway } from "@/api/hooks/gateways";
import { IGateway } from "@/utils/validators/interfaces";
import { Button, Group, Stack, Switch, TextInput, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

export const gatewayEditValidator = z.object({
  label: z.string().min(1, "Enter gateway label"),
  description: z.string().min(1, "Enter gateway description"),
  is_active: z.boolean(),
  is_private: z.boolean(),
});

export function GatewayEditModal({
  formValues,
  closeModal,
}: {
  formValues: IGateway | null;
  closeModal: () => void;
}) {
  const { mutate: editGateway, isLoading } = useEditGateway(
    formValues!.id,
    closeModal
  );
  const gatewayEditForm = useForm({
    initialValues: {
      label: formValues?.label ?? "",
      description: formValues?.description ?? "",
      is_active: formValues?.is_active ?? false,
      is_private: formValues?.is_private ?? false,
    },
    validate: zodResolver(gatewayEditValidator),
  });

  function handleSubmit(values: z.infer<typeof gatewayEditValidator>) {
    editGateway({ id: formValues!.id, ...values });
  }

  return (
    <form onSubmit={gatewayEditForm.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          size="sm"
          label="Label"
          {...gatewayEditForm.getInputProps("label")}
        />
        <Textarea
          size="sm"
          label="Description"
          {...gatewayEditForm.getInputProps("description")}
        />
       <Group
       grow>
         <Switch
          label="Is active"
          checked={gatewayEditForm.values.is_active}
          {...gatewayEditForm.getInputProps("is_active")}
        />
        <Switch 
        label="Is private"
        checked={gatewayEditForm.values.is_private}
        {...gatewayEditForm.getInputProps("is_private")}
        />
       </Group>
        <Button
          type="submit"
          size="sm"
          className="bg-primary-100"
          loading={isLoading}
          fullWidth
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}
