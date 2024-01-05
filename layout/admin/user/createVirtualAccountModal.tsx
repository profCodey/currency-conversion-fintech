import React, { useEffect, useState } from "react";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  TextInput,
  Select,
  Stack,
  Loader,
  Notification,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import Cookies from "js-cookie";
import { useGetVirtualAccountDetails } from "@/api/hooks/gateways";
import { showNotification } from "@mantine/notifications";
import { useDynamicCreateVirtualAccount } from "@/api/hooks/gateways";

interface CreateVirtualAccountModalProps {
  createVirtualAccountModalOpen: boolean;
  setCreateVirtualAccountModalOpen: (value: boolean) => void;
  gatewayId: string;
}

function CreateVirtualAccountModal({
  createVirtualAccountModalOpen,
  setCreateVirtualAccountModalOpen,
  gatewayId,
}: CreateVirtualAccountModalProps) {
  const [accountTitle, setAccountTitle] = useState<string>("");
  const {
    data: virtualAccountDetails,
    isLoading: virtualAccountDetailsLoading,
    isError: virtualAccountDetailsError,
  } = useGetVirtualAccountDetails(gatewayId);

  const {
    mutate: dynamicCreateVirtualAccount,
    isLoading: dynamicCreateVirtualAccountLoading,
  } = useDynamicCreateVirtualAccount(gatewayId);

  const virtualAccountOptions =
    virtualAccountDetails &&
    virtualAccountDetails?.data?.map(
      (item: { optioncode: string; title: string }) => ({
        value: item.optioncode as string,
        label: item.title as string,
      })
    );

  const accountFormDetails = virtualAccountDetails?.data?.filter(
    (item: { optioncode: string }) => {
      return item.optioncode === accountTitle;
    }
  );

  function closeVirtualAccountModal() {
    setCreateVirtualAccountModalOpen(false);
    addVirtualAccountForm.reset();
  }

  const generateSchema = (field: any) => {
    if (field.type === "text") {
      if (field.required) {
        return z
          .string()
          .min(1, { message: `Enter a value for ${field.label}` });
      }
      return z.string();
    } else if (field.type === "number") {
      if (field.required) {
        return z
          .number()
          .min(1, { message: `Enter a value for ${field.label}` });
      }
      return z.number();
    }
    return z.unknown();
  };

  // Validate the array of objects dynamically
  const virtualAccountFormValidator = z.object(
    Object.fromEntries(
      (accountFormDetails &&
        accountFormDetails[0]?.data?.map((field: { name: any }) => [
          field.name,
          generateSchema(field),
        ])) ||
        []
    )
  );

  const generateInitialValues = (fields: any[]) => {
    const initialValues: Record<string, number | string> = {};
    fields.forEach((field) => {
      initialValues[field.name] = field.type === "number" ? 0 : "";
    });
    return initialValues;
  };

  const initialValues = generateInitialValues(
    (accountFormDetails && accountFormDetails[0]?.data) || []
  );

  const addVirtualAccountForm = useForm({
    initialValues,
    validate: zodResolver(virtualAccountFormValidator),
  });

  let colorBackground = Cookies.get("background_color")
    ? Cookies.get("background_color")
    : "#132144";

  function handleSubmit(values: z.infer<typeof virtualAccountFormValidator>) {
    console.log("values", values);
    dynamicCreateVirtualAccount(values);
  }

  if (virtualAccountDetailsError) {
    return showNotification({
      title: "An error occured",
      message:
        "Unable to create virtual account at the moment. Please try again later.",
      color: "red",
    });
  }

  if (virtualAccountDetailsLoading) {
    return (
      <div className="mx-auto max-w-md flex items-center gap-x-2">
        Loading... <Loader color="green" />
      </div>
    );
  }
  return (
    <div>
      <Modal
        title="Add Global List"
        opened={createVirtualAccountModalOpen}
        onClose={closeVirtualAccountModal}
        size="md"
        centered
      >
        <form
          style={{ zIndex: 9999 }}
          onSubmit={addVirtualAccountForm.onSubmit(handleSubmit)}
        >
          <LoadingOverlay visible={virtualAccountDetailsLoading} />
          <Select
            label="Account Type"
            dropdownComponent="div"
            dropdownPosition="bottom"
            size="md"
            placeholder="Account Type"
            data={virtualAccountOptions}
            onChange={(value) => {
              value && setAccountTitle(value);
              addVirtualAccountForm.setFieldValue(
                "title",
                value as string | number
              );
            }}
          />
          <Stack>
            {accountFormDetails &&
              accountFormDetails[0]?.data?.map((item: any) => {
                return item.type === "text" ? (
                  <TextInput
                    size="md"
                    label={item.label}
                    placeholder={item.placeholder}
                    {...addVirtualAccountForm.getInputProps(item.name)}
                  />
                ) : (
                  <NumberInput
                    size="md"
                    label={item.label}
                    placeholder={item.placeholder}
                    {...addVirtualAccountForm.getInputProps(item.name)}
                  />
                );
              })}
            <Group grow className="mt-10">
              <Button
                className="bg-gray-30 hover:bg-gray-30 text-gray-90"
                size="md"
                type="button"
                onClick={closeVirtualAccountModal}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: colorBackground }}
                className="hover:bg-primary-100"
                size="md"
                type="submit"
                loading={dynamicCreateVirtualAccountLoading}
                loaderPosition="right"
              >
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}

export default CreateVirtualAccountModal;
