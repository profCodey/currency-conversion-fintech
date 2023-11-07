import {
    useApproveGateway,
    useClientSelectedGateways,
} from "@/api/hooks/admin/users";
import { useCreateNewGateway, useGatewayOptions, useCreateVirtualAccount } from "@/api/hooks/gateways";
import { ISelectedGateway } from "@/utils/validators/interfaces";
import {
    Badge,
    Button,
    Group,
    Modal,
    Select,
    Skeleton,
    Stack,
    Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

export const CreateGateWayValidator = z.object({
    gateway: z.string().min(1, { message: "Select gateway" }),
});

export function ClientGateways() {
    const router = useRouter();
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] =
        useState<ISelectedGateway | null>(null);
    const { gatewayOptions, isLoading: gatewaysLoading } = useGatewayOptions();
    const { data: selectedGateways, isLoading } = useClientSelectedGateways(
        router.query.id as string
    );
    const [currentGateway, setCurrentGateway] = useState<string | null>(null);

    const { mutate: createNewGateway, isLoading: createNewGatewayLoading } = useCreateNewGateway(() => {
      setCreateModalOpen(false);
    });

  
   
    const { mutate: approveGateway, isLoading: approveGatewayLoading } =
      useApproveGateway(() => {
        setRejectModalOpen(false);
        setApproveModalOpen(false);
      });

      function handleSubmit() {
        createNewGateway({
          gateway: currentGateway ? parseInt(currentGateway) : 0,
          user: parseInt(router.query.id as string)
        });
      }


      const createNewGateForm = useForm({
        initialValues: {
          gateway: "",
        },
        validate: zodResolver(CreateGateWayValidator),
      });

    function handleApproveGateway(gateway: ISelectedGateway) {
        setApproveModalOpen(true);
        setSelectedGateway(gateway);
    }

    function handleRejectGateway(gateway: ISelectedGateway) {
        setRejectModalOpen(true);
        setSelectedGateway(gateway);
    }
    function handleGatewayChange(gateway: string) {
        setCurrentGateway(gateway);
        createNewGateForm.setFieldValue("gateway", gateway);
    }

    if (isLoading) {
        return (
            <Stack>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </Stack>
        );
    }

    return (
        <section className="p-5">
            <div className="flex flex-row gap-4">
                <h3 className="text-gray-90 font-semibold mb-2">
                    List of selected gateways
                </h3>
                <h3
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setCreateModalOpen(true)}>
                    Add new gateway
                </h3>
                <Modal
                    onClose={() => setCreateModalOpen(false)}
                    opened={createModalOpen}
                    withCloseButton={true}
                    centered
                    title="Select new gateway">
                    <Skeleton visible={isLoading}>
                        <form
                        onSubmit={createNewGateForm.onSubmit(
                          handleSubmit)}
                        >
                            <Stack>
                                <Select
                                    label="Gateway"
                                    data={gatewayOptions}
                                    placeholder="Select gateway"
                                    size="md"
                                    {...createNewGateForm.getInputProps(
                                        "gateway"
                                    )}
                                    onChange={handleGatewayChange}
                                />
                               
                               
                                <Button
                                    className="bg-primary-100 hover:bg-primary-100 my-5"
                                    size="md"
                                    type="submit"
                                    >
                                    Create
                                </Button>
                            </Stack>
                        </form>
                    </Skeleton>
                </Modal>
            </div>
            <Skeleton visible={approveGatewayLoading}>
                <Stack>
                    {selectedGateways?.data &&
                    selectedGateways?.data?.length > 0 ? (
                        selectedGateways?.data.map((gateway, idx) => (
                            <GatewayOption
                                key={idx}
                                gateway={gateway}
                                approveGateway={handleApproveGateway}
                                rejectGateway={handleRejectGateway}
                            />
                        ))
                    ) : (
                        <Text>Client has not selected any gateway</Text>
                    )}
                </Stack>
            </Skeleton>

            <Modal
                onClose={() => setApproveModalOpen(false)}
                opened={approveModalOpen}
                withCloseButton={false}
                centered>
                <Stack spacing="xl">
                    <Text className="text-xl font-semibold text-accent font-secondary">
                        Approve Gateway
                    </Text>
                    <Text className="text-lg">{`Are you sure you want to approve the ${selectedGateway?.gateway_name} gateway?`}</Text>
                    <Group position="center" grow>
                        <Button
                            size="md"
                            className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
                            onClick={() => setApproveModalOpen(false)}>
                            No, Cancel
                        </Button>
                        <Button
                            size="md"
                            className="bg-primary-100 hover:bg-primary-100"
                            loading={approveGatewayLoading}
                            onClick={() =>
                                approveGateway({
                                    id: selectedGateway!.id,
                                    status: "approved",
                                })
                            }>
                            Yes, Approve
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal
                onClose={() => setRejectModalOpen(false)}
                opened={rejectModalOpen}
                withCloseButton={false}
                centered>
                <Stack spacing="xl">
                    <Text className="text-xl font-semibold text-accent font-secondary">
                        Reject Gateway
                    </Text>
                    <Text className="text-lg">{`Are you sure you want to reject the ${selectedGateway?.gateway_name} gateway?`}</Text>
                    <Group position="center" grow>
                        <Button
                            size="md"
                            className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
                            onClick={() => setRejectModalOpen(false)}>
                            No, Cancel
                        </Button>
                        <Button
                            size="md"
                            className="bg-primary-100 hover:bg-primary-100"
                            onClick={() =>
                                approveGateway({
                                    id: selectedGateway!.id,
                                    status: "rejected",
                                })
                            }
                            loading={approveGatewayLoading}>
                            Yes, Reject
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </section>
    );
}

export interface createVirtualAccountPayload {
    selected_gateway_id: string
  }

function GatewayOption({
    gateway,
    approveGateway,
    rejectGateway,
}: {
    gateway: ISelectedGateway;
    approveGateway: (arg0: ISelectedGateway) => void;
    rejectGateway: (arg0: ISelectedGateway) => void;
}) {
    const { mutate: createVirtualAccount, isLoading: createVirtualAccountLoading } = useCreateVirtualAccount(() => {
      console.log("Virtual account created");    })

     
      function handleCreate ( gateway_id: string ) {
        console.log(gateway_id)
        const selected_gateway_id = gateway_id
        console.log(selected_gateway_id)
        createVirtualAccount(selected_gateway_id)
    }

    

    return (
        <Group key={gateway.id}>
            {/* <Text>{idx + 1}</Text> */}
            <Text>{gateway.gateway_name}</Text>
            <Button
                className="bg-primary-100 "
                onClick={() =>handleCreate(gateway?.id as unknown as string)}
                >
                    Create Virtual Account
                </Button>
            <Group className="ml-auto" spacing="sm">
                {gateway.status === "pending" ? (
                    <>
                        <Button
                            className="bg-primary-100"
                            onClick={() => approveGateway(gateway)}>
                            Approve
                        </Button>
                        <Button
                            variant="outline"
                            color="red"
                            onClick={() => rejectGateway(gateway)}>
                            Reject
                        </Button>
                    </>
                ) : (
                    <Badge
                        size="lg"
                        variant="dot"
                        color={gateway.status === "approved" ? "green" : "red"}>
                        {gateway.status === "approved"
                            ? "Approved"
                            : "Not approved"}
                    </Badge>
                )}
            </Group>
        </Group>
    );
}
