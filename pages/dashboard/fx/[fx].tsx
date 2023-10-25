import { z } from "zod";
import { AppLayout } from "@/layout/common/app-layout";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useRef } from "react";

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
// import { PayRecipient } from "../../../recipients/recipient-list";
import { CurrencyDetailType, IRecipient } from "@/utils/validators/interfaces";
import { useDefaultGateway } from "@/api/hooks/gateways";
import { useIsVerified } from "@/api/hooks/user";
import { PayRecipient } from "@/layout/recipients/recipient-list";
import { PayFxRecipient } from "@/layout/common/send-fx-modal";
import { ConvertFundFxPayRecipient, FxProceedModal } from "@/layout/common/fx-proceed-modal";
import { useGetFxPurposes } from "@/api/hooks/fx";
// import { PayFxRecipient, SendFxMoneyModal } from "../common/send-fx-modal";



const ConvertFxFundPage = () => {
  const sourceRef = useRef<CurrencyDetailType | null>(null);
  const liveRateRef = useRef<number | null>(null);
  const sourceAmountRef = useRef<number>(1);
  const destinationRef = useRef<CurrencyDetailType | null>(null);
  const router = useRouter();

  const fx = router.query["fx"];
  // const liveRate = useRef<number>(1);
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
  const [recipientDetails, setRecipientDetails] = useState<z.infer<typeof ConvertFundFxPayRecipient> & Record<string,any>>({
    bank: "",
    amount: 1000,
    account_name: "",
    account_number: "",
    narration: "",
    currency: (fx as string) || "",
    bic: "",
    source_of_funds:{
      type: "",
      name: "",
      size: 0
    },
    invoice:{
      type: "",
      name: "",
      size: 0
    },
  });

  const initialState = {
    currency: "",
    amount: 0,
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
    zip_code: "",
    narration: "",
    source_of_funds:{
      type: "",
      name: "",
      size: 0
    },
    invoice:{
      type: "",
      name: "",
      size: 0
    },
    
  };

  // @ts-ignore
  const [fxRecipientDetails, setFxRecipientDetails] = useState<z.infer<typeof ConvertFundFxPayRecipient> & Record<string,any> >(initialState);
  const [showFxModal, setShowFxModal] = useState(false);
  const [showSelectRecipientModal, setShowSelectRecipientModal] =
    useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);

  const { data: rates, isLoading: ratesLoading } = useGetRates();
  const { data: allAccounts, isLoading: allAccountsLoading } = useGetAccounts();
  const { fxPurposes, isLoading: isLoadingPurpose } = useGetFxPurposes();
  // console.log({ allAccounts: allAccounts?.data });

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
  const [sourceDetails, setSourceDetails] = useState<CurrencyDetailType>({
    label: "",
    value: "",
    currencyId: "",
    currencyName: "",
    category: "",
    code: "",
  });
  const [destinationDetails, setDestinationDetails] =
    useState<CurrencyDetailType>({
      label: "",
      value: "",
      currencyId: "",
      currencyName: "",
      category: "",
      code: "",
    });

  // const [destinationAmount, setDestinationAmount] = useState(0);

  const [currentCurrency, setCurrentCurrency] = useState<{
    source: string | null;
    destination: string | null;
  }>({
    source: "",
    destination: "",
  });

  // console.log(liveRateValue, "data for liveRateValue");

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
          if (account?.value === (fx as string)) {
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
              return account;
            }
          })
          .map((acc) => {
            return {
              ...acc,
              label: acc["currencyName"],
            };
          })
      : [];
  }, [allAccountsDataMap, fx]);

  // console.log({ destinationAccountsData: allAccountsData });

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
    if(destinationDetails.currencyId && destinationDetails.code && destinationDetails.value){
      destinationRef.current = destinationDetails;

      // console.log({destinationDetails},"DESTINATION DETAILS DATA");
      // console.log({destinationDetailsREF:destinationRef.current},"DESTINATION DETAILS REF DATA");
      
    }
    
  },[destinationDetails])

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

  function handleExchange() {
    // exchange({
    //   amount: sourceAmount.toString(),
    //   destination_account: Number(destinationAccIdValue),
    //   source_account: Number(sourceAccIdValue),
    // });
  }

  // useEffect(() => {
  //   if (liveRate && sourceAmount) {
  //     // setDestinationAmount(sourceAmount);
  //   }
  // }, [liveRate, sourceAmount]);

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
            <NumberInput
              className="flex-grow"
              label="You send"
              value={sourceAmount}
              onChange={(value) => setSourceAmount(value as number)}
              precision={2}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                  : ""
              }
              min={1}
            />
          </section>
          <section className="h-24 flex items-center justify-center relative">
            <div className="absolute h-full w-5 bg-white mx-auto"></div>
            <div className="relative h-10 aspect-square rounded-full bg-white flex items-center justify-center">
              <ConvertIcon />
            </div>
          </section>
          <section className="bg-white p-4 rounded border flex gap-4">
            <Select
              className="flex-grow"
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

            <NumberInput
              className="flex-grow"
              label="You receive"
              disabled
              //   parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              // formatter={(value) =>
              //   !Number.isNaN(parseFloat(value))
              //     ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              //     : ""
              // }
              value={destinationAccCurrency ? sourceAmount * liveRate : 0}
            />
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
              // !sourceAccCurrency ||
              // !destinationAccCurrency ||
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

        <FxProceedModal
          modalOpen={showConfirmationModal}
          close={() => setShowConfirmationModal(false)}
          banks={bankOptions}
          currencies={currencyOptions}
          gateway={defaultGateway?.gateway}
          recipientDetails={{ ...recipientDetails, bic: "" }}
          purposes={fxPurposes}
          sourceDetails={!sourceDetails.value && sourceRef.current?.value ? sourceRef.current : sourceDetails}
          destinationDetails={!destinationDetails.currencyId && destinationRef.current?.currencyId ? destinationRef.current : destinationDetails}
          sourceAmount={
            (sourceAmount > 1 && sourceAmount) || sourceAmountRef.current
          }
          currencyRate={liveRate! || liveRateRef.current}
        />
      </div>
    </section>
  );
};

export default ConvertFxFundPage;

ConvertFxFundPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
