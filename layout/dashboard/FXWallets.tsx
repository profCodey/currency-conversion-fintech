import { useFXWalletAccounts, useGetAccounts } from "@/api/hooks/accounts";
import { useGetClientDetails } from "@/api/hooks/user";
import { Skeleton, Modal, Stack, Select, Button } from "@mantine/core";
import Link from "next/link";
import { ReactNode, useState } from "react";
import FxBalance from "../common/fx-balance";
import NGNBalance from "../common/ng-balance";
import { useCreateNewGateway, useGatewayOptions, useAddGateway } from "@/api/hooks/gateways";
import { useRouter } from "next/router";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useClientSelectedGateways } from "@/api/hooks/admin/users";

export function FXWallets({ userId }: { userId: number | undefined }) {
  const { data: clientDetails, isLoading: clientDetailsLoading } =
    useGetClientDetails(userId);
  const { isLoading: walletsLoading, data: wallets } = useGetAccounts();
  const { data: fxData } = useFXWalletAccounts();

  if (clientDetailsLoading || walletsLoading) {
    return (
      <WalletsContainer>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </WalletsContainer>
    );
  }

  if (wallets?.data.length === 0) {
    return (
      <UnapprovedWalletsContainer></UnapprovedWalletsContainer>
    );
  }

  const firstNGNAccountId = wallets?.data.filter(
    (wallet) => wallet.category == "local"
  )[0]?.id;

  const walletItem = wallets?.data.filter(
    (wallet) => wallet.category === "local"
  )[0];

  return (
    <>
      {fxData?.data && 'use_fx_wallet' in fxData?.data && fxData?.data.use_fx_wallet ? (
        <>
          <WalletsContainer>
            {wallets?.data
              .filter((wallet) => wallet.category == "fx")
              .map((wallet) => (
                <FxBalance key={wallet.id} wallet={wallet} />
              ))}
          </WalletsContainer>
          <NGNWalletContainer>
          {wallets?.data
            .filter((wallet) => wallet.category === "local")
            .map((wallet) => (
              <NGNBalance key={wallet.id} wallet={wallet} />
            ))}
        </NGNWalletContainer>
        </>
      ) : (
        <FXNonWalletsContainer account_id={firstNGNAccountId}>
          {/* <NGNWalletContainer> */}
            {walletItem && (
              <NGNBalance key={walletItem?.id} wallet={walletItem} />
            )}
          {/* </NGNWalletContainer> */}
        </FXNonWalletsContainer>
      )}
    </>
  );
}

function UnapprovedWalletsContainer() {
  return (
    <div className="py-6 px-6 bg-white rounded-3xl border font-semibold flex flex-col items-center">
      <section className="text-primary-70 text-sm">
        <div className="text-2xl text-semibold mb-2 text-[#6882B6] hover:underline hover:text-blue-500 cursor-pointer"
          >
            Your account is currently pending approval. Please check back at a later time or contact support.
        </div>
      </section>

    </div>
  );
}

function FXNonWalletsContainer({
  account_id,
  children,
}: {
  account_id: number | undefined;
  children?: ReactNode;
}) {
  return (
    <div className="py-6 px-6 bg-white rounded-3xl border font-semibold flex flex-col items-center">
      <section className="text-primary-70 text-sm">
        <div>
          <Link
            href={`/dashboard/ngn/${account_id}`}
            className="text-2xl text-semibold mb-2 text-[#6882B6] hover:underline hover:text-blue-500 cursor-pointer"
          >
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
              Exchange
            </button>
          </Link>
        </div>
      </section>

      {!!children && (
        <section className="flex items-center justify-center mt-8 w-full  bg-[#EFF3FB] p-4 rounded-md ">
          {children}
        </section>
      )}
    </div>
  );
}

function WalletsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="py-6 px-6 bg-white rounded-3xl border font-semibold flex flex-col gap-4">
      <section className="flex justify-between items-center text-primary-70 text-sm">
        <div>
          <p className="text-2xl text-semibold mb-2 text-[#6882B6]">
            FX Balances
          </p>
          <span className="text-black font-normal text-base">
            Click on the account for more information
          </span>
        </div>
        {/* <span role="button" className="text-[#03A1DB] font-semibold">Request Additional Account </span> */}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 rounded-[18px] p-3 grid-rows-[repeat(1 ,_minmax(4rem,_auto))] gap-4 mt-3 bg-[#EFF3FB] ">
        {children}
      </section>
    </div>
  );
}
export function NGNWalletContainer({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentGateway, setCurrentGateway] = useState<string | null>(null);
  const { mutate: addGateway, isLoading:gatewayLoading } = useAddGateway();
  const { gatewayOptions, isLoading: gatewaysLoading } = useGatewayOptions();
  const CreateGateWayValidator = z.object({
    gateway: z.string().min(1, { message: "Select gateway" }),
});
function handleGatewayChange(gateway: string) {
  setCurrentGateway(gateway);
  createNewGateForm.setFieldValue("gateway", gateway);
}

  function handleSubmit() {
    addGateway({
      gateway: currentGateway ? parseInt(currentGateway) : 0,
    });
    setCreateModalOpen(false)
  }

  const createNewGateForm = useForm({
    initialValues: {
      gateway: "",
    },
    validate: zodResolver(CreateGateWayValidator),
  });

  return (
    <div className="py-6 px-6 bg-white rounded-3xl border font-semibold flex flex-col gap-4">
      <section className="flex justify-between items-center text-primary-70 text-sm">
        <div>
          <p className="text-2xl text-semibold mb-2 text-[#6882B6]">
            Naira Gateways
          </p>
          <span className="text-black font-normal text-base">
            Click on the account for more information
          </span>
        </div>
        <span role="button" className="text-[#03A1DB] font-semibold"
        onClick={() => setCreateModalOpen(true)}>
        Request Another Gateway </span>
      </section>

      <Modal
                    onClose={() => setCreateModalOpen(false)}
                    opened={createModalOpen}
                    withCloseButton={true}
                    centered
                    title="Select new gateway">
                    <Skeleton visible={gatewaysLoading}>
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
                                    type="submit">
                                    Create
                                </Button>
                            </Stack>
                        </form>
                    </Skeleton>
                </Modal>

      {/* <section className="grid grid-cols-1 lg:grid-cols-3 rounded-[18px] p-3 grid-rows-[repeat(1,_minmax(4rem,_auto))] gap-4 mt-3 bg-[#EFF3FB] ">
        {children}
      </section> */}
      <section className="grid grid-cols-1 lg:grid-cols-3  grid-rows-[repeat(1,_minmax(4rem,_auto))] gap-4 mt-3 bg-[#EFF3FB]  rounded-[18px] p-3">
        {children}
      </section>
    </div>
  );
}

