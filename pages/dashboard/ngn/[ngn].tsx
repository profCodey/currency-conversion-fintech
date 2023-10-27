import { z } from "zod";
import { AppLayout } from "@/layout/common/app-layout";
import { useRouter } from "next/router";
import { ChangeEvent, ReactElement, useMemo, useRef } from "react";

import { ConvertIcon } from "@/components/icons";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useCurrencyOptions } from "@/api/hooks/currencies";
import { useCallback, useEffect, useState } from "react";
import { useGetRates } from "@/api/hooks/admin/rates";
import { Warning2 } from "iconsax-react";
import { currencyFormatter } from "@/utils/currency";
import { useExchange } from "@/api/hooks/exchange";
import { showNotification } from "@mantine/notifications";
import { useGetAccounts } from "@/api/hooks/accounts";
import { useGetLiveRate } from "@/api/hooks/admin/rates";
import { SendMoneyModal } from "@/layout/common/send-money-modal";
import { useGetRecipients } from "@/api/hooks/recipients";
import { useBankOptions } from "@/api/hooks/banks";
// import { LocalExchangePayRecipientPayRecipient } from "../../../recipients/recipient-list";
import { CurrencyDetailType, IRecipient } from "@/utils/validators/interfaces";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { useIsVerified } from "@/api/hooks/user";
import { PayFxRecipient } from "@/layout/common/send-fx-modal";

import {
  LocalExchangePayRecipient,
  LocalProceedModal,
} from "@/layout/common/local-proceed-modal";
import { useGetFxPurposes } from "@/api/hooks/fx";
// import { PayFxRecipient, SendFxMoneyModal } from "../common/send-fx-modal";

const ExchangeFxFundPage = () => {
  const sourceRef = useRef<CurrencyDetailType | null>(null);
  const liveRateRef = useRef<number | null>(null);
  const sourceAmountRef = useRef<number>(1);
  const destinationRef = useRef<CurrencyDetailType | null>(null);
  const router = useRouter();
  const fx = router.query["ngn"] as string;

  const {
    isLoading: currenciesLoading,
    currencyOptionsWithId,
    currencyOptions,
  } = useCurrencyOptions();

  const { isLoading: recipientsLoading, data: recipients } = useGetRecipients();
  const {
    bankOptions,
    isLoading: loadingBanks,
    getBankName,
  } = useBankOptions();

  const { isLoading, defaultGateway } = useDefaultGateway();
  const { isLoading: isVerifyLoading, isVerified } = useIsVerified();

  // @ts-ignore
  const [recipientDetails, setRecipientDetails] = useState<
    z.infer<typeof LocalExchangePayRecipient> & Record<string, any>
    // @ts-ignore
  >({
    bank: "",
    amount: 1000,
    account_name: "",
    account_number: "",
    narration: "",
    currency: (fx as string) || "",
    bic: "",
    source_of_funds: {
      type: "",
      name: "",
      size: 0,
    },
    invoice: {
      type: "",
      name: "",
      size: 0,
    },
  });

  const initialState = {
    currency: "",
    amount: 1000,
    account_name: "",
    account_number: "",
    bank_name: "",
    bank: "",
    sort_code: "",
    bic: "",
    iban: "",
    recipient_address: "",
    city: "",
    state: "",
    zipcode: "",
    narration: "",
    source_of_funds: {
      type: "",
      name: "",
      size: 0,
    },
    invoice: {
      type: "",
      name: "",
      size: 0,
    },
  };

  const [fxRecipientDetails, setFxRecipientDetails] = useState<
    z.infer<typeof LocalExchangePayRecipient> & Record<string, any>
    // @ts-ignore
  >(initialState);
  const [showFxModal, setShowFxModal] = useState(false);
  const [showSelectRecipientModal, setShowSelectRecipientModal] =
    useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const { data: rates, isLoading: ratesLoading } = useGetRates();
  const { data: allAccounts, isLoading: allAccountsLoading } = useGetAccounts();
  // console.log({allAccounts:allAccounts?.data});
  const { fxPurposes, isLoading: isLoadingPurpose } = useGetFxPurposes();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { mutate: exchange, isLoading: exchangeLoading } = useExchange(() =>
    setShowConfirmationModal(false)
  );
  const [sourceAmount, setSourceAmount] = useState(1);

  const [sourceAccCurrency, setSourceAccCurrency] = useState(
    (fx as string) || ""
  );
  const [destinationAccCurrency, setDestinationAccCurrency] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [destinationCurrency, setDestinationCurrency] = useState("");
  const [sourceAccIdValue, setSourceAccIdValue] = useState("");
  const [destinationAccIdValue, setDestinationAccIdValue] = useState("");
  const [destinationDetails, setDestinationDetails] =
    useState<CurrencyDetailType>({
      label: "",
      value: "",
      currencyId: "",
      currencyName: "",
      category: "",
      code: "",
    });
  const [sourceDetails, setSourceDetails] = useState<CurrencyDetailType>({
    label: "",
    value: "",
    currencyId: "",
    currencyName: "",
    category: "",
    code: "",
  });
  const [destinationAmount, setDestinationAmount] = useState(0);
  const [toPay, setToPay] = useState<number>(1)
  const [toReceive, setToReceive] = useState<number>(0)

  const [currentCurrency, setCurrentCurrency] = useState<{
    source: string | null;
    destination: string | null;
  }>({
    source: "",
    destination: "",
  });

  const allAccountsDataMap = useMemo(() => {
    return (
      allAccounts?.data.map((account: any) => {
        const data = {
          label: account?.label! as string,
          value: account?.id?.toString(),
          currencyId: account?.currency?.id.toString(),
          currencyName: account?.currency?.name,
          category: account?.category,
          code: account?.currency?.code,
        };
        return data;
      }) ?? []
    );
  }, [allAccounts]);

  const selectAccountData: CurrencyDetailType[] = useMemo(() => {
    return allAccountsDataMap.length > 0
      ? allAccountsDataMap.filter((account: any) => {
          // console.log({account},'ac in selectAccountData');

          if (account?.value == (fx as string)) {
            const data = {
              ...account,
              disabled: true,
            };

            return data;
          }
        })
      : [];
  }, [allAccountsDataMap, fx]);

  // console.log({selectAccountData});

  const allAccountsData = useMemo(() => {
    return allAccountsDataMap.length > 0
      ? allAccountsDataMap
          .filter((account: any) => {
            if (
              account?.value !== (fx as string) &&
              account?.category === "fx"
            ) {
              const data = {
                // label: account?.label,
                // value: account?.id?.toString(),
                // currencyId: account?.currency?.id.toString(),
                // currencyName: account?.currency?.name,
                // category:account?.category,
                ...account,
              };
              return data;
            }
          })
          .map((acc) => {
            return {
              ...acc,
              label: acc["currencyName"],
            };
          })
      : [];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAccountsDataMap,fx]);

  // console.log({ allAccountsData });
  const {
    data: liveRateValue,
    isLoading: isLoadingLiveRate,
    isError,
  } = useGetLiveRate({
    source: sourceAccCurrency || sourceDetails?.value,
    destination: destinationAccCurrency || destinationDetails?.currencyId,
  });

  const liveRate = liveRateValue?.data?.rate;

  useEffect(() => {
    if (selectAccountData.length > 0 && selectAccountData[0]) {
      setSourceDetails((d: CurrencyDetailType) => {
        return {
          ...d,
          ...selectAccountData[0],
        };
      });

      setSourceAccCurrency(selectAccountData[0].currencyId);

      sourceRef.current = { ...selectAccountData[0] } as CurrencyDetailType;

      // console.log({ sourceDetails }, "SOURCE DETAILS UPDATED");
      // console.log({ sourceRefData: sourceRef.current }, "SOURCE Detail REF DATA");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAccountData,allAccounts]);

  useEffect(() => {
    if (sourceAmount > 1) {
      sourceAmountRef.current = sourceAmount;

      // console.log({sourceAmount},"SOURCE AMOUNT DATA");
      // console.log({ sourceAmountREF: sourceAmount }, "SOURCE Amount REF DATA");
    }
  }, [sourceAmount]);

  useEffect(() => {
    if (!!liveRate) {
      liveRateRef.current = liveRate;
      // console.log({ liveRate }, "LIFE RATE DATA");
      // console.log({ liveRateREF: liveRate }, "LIFE RATE REF DATA");
    }
  }, [liveRate]);

  useEffect(() => {
    // console.log({destinationDetails});
    if (
      destinationDetails.currencyId &&
      destinationDetails.code &&
      destinationDetails.value
    ) {
      destinationRef.current = destinationDetails;

      // console.log({destinationDetails},"DESTINATION DETAILS DATA");
      // console.log({destinationDetailsREF:destinationRef.current},"DESTINATION DETAILS REF DATA");
    }
  }, [destinationDetails]);

  function getCurrencyNameFromId(id: string | null) {
    const currency = currencyOptionsWithId.find(
      (currency: any) => currency.value === id
    );
    return currency?.label;
  }

  function handleProceedClick() {
    if (sourceAmount < 1) {
      return showNotification({
        title: "Error",
        message: `You have entered an invalid amount`,
        color: "red",
      });
    }

    setShowConfirmationModal(true);
  }

  const handleToPayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setToPay(newValue);
    setToReceive(Number((newValue * liveRate).toFixed(2))); 
  };

  const handleToReceiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setToReceive(newValue);
    setToPay(Math.round(newValue / liveRate));    
  };

  return (
    <section className="w-full h-full min-h-screen flex items-center justify-center">
      <div className="bg-gray-30 border rounded-lg p-4">
        <Skeleton visible={currenciesLoading || ratesLoading}>
          <section className="text-primary-70 text-lg text-center">
            Exchange your fund
          </section>

          {liveRate == null && sourceAccCurrency && destinationAccCurrency && (
            <div className="text-red-600 font-medium font-secondary text-sm text-center mt-1">
              Rate not set for selected pair
            </div>
          )}
          {!sourceAccCurrency && !destinationAccCurrency && (
            <div className="text-red-600 font-medium font-secondary text-sm text-center mt-1">
              You have to select source and destination currency pair
            </div>
          )}
          {sourceAccCurrency && !destinationAccCurrency && (
            <div className="text-red-600 font-medium font-secondary text-sm text-center mt-1">
              You have to select destination currency
            </div>
          )}
          {!sourceAccCurrency && destinationAccCurrency && (
            <div className="text-red-600 font-medium font-secondary text-sm text-center mt-1">
              You have to select source currency
            </div>
          )}

          <section className="bg-white p-4 rounded border flex gap-4">
            <Select
              className="flex-grow"
              label="Source"
              disabled={true}
              value={currentCurrency.source || selectAccountData[0]?.value}
              defaultValue={selectAccountData[0]?.value}
              // allowDeselect={false}
              onChange={(value) => {
                // console.log({ value });

                const selected = selectAccountData[0];
                setSourceCurrency(selected?.currencyName);
                setSourceAccCurrency(selected?.currencyId);
                setSourceAccIdValue(selected?.value);
                setCurrentCurrency({
                  ...currentCurrency,
                  source: selected?.value,
                });
              }}
              data={selectAccountData}
              nothingFound={"No currencies found"}
            />
            <div className="flex flex-col text-sm font-medium mt-1">
           <label>You Send</label>
              <input
                style={{
                  height: "36px",
                  paddingLeft: "10px",
                  color: "grey",
                  width: "200px",
                  border: "1px solid #E0E0E0",
                  transition: "border 0.3s",
                }}
        type="number"
        placeholder="To Pay"
        value={toPay}
        onChange={(e)=>handleToPayChange(e)}
      />
      </div>
          </section>
          <section className="h-24 flex items-center justify-center relative">
            <div className="absolute h-full w-5 bg-white mx-auto"></div>
            <div className="relative h-10 aspect-square rounded-full bg-white flex items-center justify-center">
              <ConvertIcon />
            </div>
          </section>
          <section className="bg-white p-4 rounded border flex gap-4">
            <Select
              className=""
              label="Destination"
              value={currentCurrency.destination}
              onChange={(value) => {
                const selectedAcc = allAccountsData?.filter(
                  (acc) => acc.value === value
                );
                // console.log({ selectedAcc });
                setDestinationDetails((d) => {
                  return {
                    ...d,
                    ...selectedAcc[0],
                  };
                });
                setDestinationAccCurrency(selectedAcc[0]?.currencyId);
                setDestinationCurrency(selectedAcc[0]?.currencyName);
                setDestinationAccIdValue(selectedAcc[0]?.value);
                setCurrentCurrency({
                  ...currentCurrency,
                  destination: value,
                });
              }}
              data={allAccountsData}
            />

            <div className="flex flex-col text-sm font-medium mt-1">
              <label>You Receive</label>
              <input
                style={{
                  height: "36px",
                  paddingLeft: "10px",
                  color: "grey",
                  width: "200px",
                  border: "1px solid #E0E0E0",
                  transition: "border 0.3s",
                }}
                type="number"
                step="1"
                placeholder="You Receive"
                value={toReceive}
                onChange={(e) => handleToReceiveChange(e)}
              />
            </div>
          </section>

          <div className="text-primary-70 text-center my-5 text-sm">
            {!sourceAccCurrency || !destinationAccCurrency ? (
              <span className="font-semibold">
                Select a source and destination currency to view market rate
              </span>
            ) : (
              <>
                <span className="font-semibold">Market Rate:</span> 1&nbsp;
                {sourceCurrency || selectAccountData[0]?.currencyName}
                &nbsp;=&nbsp;
                {liveRate || "[Not set]"}&nbsp;{destinationCurrency}
              </>
            )}
          </div>

          <Button
            disabled={
              !liveRate ||
              // !sourceAccCurrency || !destinationAccCurrency
              !sourceDetails.currencyId ||
              !destinationDetails.currencyId
            }
            className="bg-accent hover:bg-accent"
            size="md"
            fullWidth
            onClick={handleProceedClick}
          >
            Proceed
          </Button>
        </Skeleton>

        <LocalProceedModal
          modalOpen={showConfirmationModal}
          close={() => setShowConfirmationModal(false)}
          banks={bankOptions}
          currencies={currencyOptions}
          gateway={defaultGateway?.gateway}
          recipientDetails={{ ...recipientDetails, bic: "" }}
          purposes={fxPurposes}
          destinationAmount = {toReceive}
          sourceDetails={
            !sourceDetails.value && sourceRef.current?.value
              ? sourceRef.current
              : sourceDetails
          }
          destinationDetails={
            !destinationDetails.currencyId && destinationRef.current?.currencyId
              ? destinationRef.current
              : destinationDetails
          }
          sourceAmount={
            // (sourceAmount > 1 && sourceAmount) || sourceAmountRef.current
            toPay
          }
          destinationAccCurrency = {destinationCurrency}
          sourceCurrency={sourceCurrency || selectAccountData[0]?.currencyName
          }
          currencyRate={liveRate! || liveRateRef.current}
        />
      </div>
    </section>
    
  );
};

export default ExchangeFxFundPage;

ExchangeFxFundPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};