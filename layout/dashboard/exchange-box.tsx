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
import { useFxBalance } from "@/api/hooks/balance";
import { showNotification } from "@mantine/notifications";
import { useGetFxAccounts } from "@/api/hooks/fx";
import { useGetAccounts } from "@/api/hooks/accounts";
import { useGetLiveRate } from "@/api/hooks/admin/rates";

export function ExchangeBox() {
  const { data: fxAccounts, isLoading: _fxAccountsLoading } =
    useGetFxAccounts();
  const {
    isLoading: currenciesLoading,
    currencyOptionsWithId,
    currencyOptions,
  } = useCurrencyOptions();
  const { data: rates, isLoading: ratesLoading } = useGetRates();
  const { getBalanceFromCurrency, isLoading: fxAccountsLoading } =
    useFxBalance();
    useGetFxAccounts();
    const { data: allAccounts, isLoading: allAccountsLoading } =
    useGetAccounts();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { mutate: exchange, isLoading: exchangeLoading } = useExchange(() =>
    setShowConfirmationModal(false)
  );
  const [sourceAmount, setSourceAmount] = useState(1);
  const [currentCurrency, setCurrentCurrency] = useState<{
    source: string | null;
    destination: string | null;
  }>({
    source: "",
    destination: "",
  });

  const [sourceAccCurrency, setSourceAccCurrency] = useState("");
  const [destinationAccCurrency, setDestinationAccCurrency] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [destinationCurrency, setDestinationCurrency] = useState("");
  const [amountToReceive, setAmtToReceive] = useState(0);
  const { data: liveRateValue, isLoading, isError } = useGetLiveRate({
    source: sourceAccCurrency,
    destination: destinationAccCurrency,
  });
  let liveRate = liveRateValue?.data?.rate;

  useEffect(
    function () {
      const source = currencyOptionsWithId[0]?.value;
      const destination = currencyOptionsWithId[1]?.value;
      setCurrentCurrency({
        source,
        destination,
      });
    },
    [currencyOptionsWithId, currencyOptionsWithId.length]
  );
  
  const allAccountsData =
  allAccounts?.data
    .map((account) => ({
      label: account.label,
      value: account.id.toString(),
      currencyId : account.currency.id.toString(),
    })) ?? [];

  function getCurrencyNameFromId(id: string | null) {
    const currency = currencyOptionsWithId.find(
      (currency) => currency.value === id
    );
    return currency?.label;
  }

  function handleExchangeClick() {
    console.log('hello');
    
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
    exchange({
      amount: sourceAmount.toString(),
      destination_account: getAccountFromCurrencyId(destinationAccCurrency) as number,
      source_account: getAccountFromCurrencyId(sourceAccCurrency) as number,
    });
  }

  function getAccountFromCurrencyId(currency: string | null) {
    const fxAcc =
      fxAccounts?.data.find((acc) => acc.currency.id === Number(currency)) ??
      null;
    return fxAcc?.id;
  }

  return (
    <div className="bg-gray-30 border rounded-lg p-4">
      <Skeleton visible={currenciesLoading || ratesLoading}>
        <section className="bg-white p-4 rounded border flex gap-4">
          <Select
            className="flex-grow"
            label="Source"
            value={currentCurrency.source}
            onChange={(value) => {
              const selectedAcc = allAccountsData.filter(acc=> acc.value === value)      
              setSourceCurrency(selectedAcc[0].label);
            setSourceAccCurrency(selectedAcc[0].currencyId);
              setCurrentCurrency({
                ...currentCurrency,
                source: value,
              });
            }}
            data={allAccountsData}
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
              const selectedAcc = allAccountsData.filter(acc=> acc.value === value)
              setDestinationAccCurrency(selectedAcc[0].currencyId)
              setDestinationCurrency(selectedAcc[0].label);              
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
            value={sourceAmount * liveRate}
          
          />
        </section>

        <div className="text-primary-70 text-center my-5 text-sm">
          <span className="font-semibold">Market Rate:</span> 1{" "}
          {getCurrencyNameFromId(sourceAccCurrency)} ={" "}
          {liveRate || "[Not set]"}{" "}
          {getCurrencyNameFromId(destinationAccCurrency)}
        </div>
        <Button
          disabled={!liveRate || 
           !destinationAccCurrency}
          className="bg-accent hover:bg-accent"
          size="md"
          fullWidth
          onClick={handleExchangeClick}
        >
          Exchange
        </Button>

        {liveRate == null && (
          <div className="text-red-600 font-medium font-secondary text-sm text-center mt-1">
            Rate not set for selected pair
          </div>
        )}
      </Skeleton>

      <Modal
        opened={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      >
        <Stack align="center" className="w-full">
          <Warning2 size={60} />
          <div className="text-center">
            Are you sure you want to request to exchange{" "}
            <span className="font-medium">
              {currencyFormatter(sourceAmount)}{" "}
            </span>
            {getCurrencyNameFromId(sourceAccCurrency)} for{" "}
            <span className="font-medium">
              {currencyFormatter(sourceAmount * liveRate)}{" "}
            </span>{" "}
            {getCurrencyNameFromId(destinationAccCurrency)}
          </div>

          <Group grow className="w-full">
            <Button
              className="bg-white hover:bg-white text-red-600 border-1 border-red-600"
              onClick={() => setShowConfirmationModal(false)}
              size="md"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-100 hover:bg-primary-100"
              loading={exchangeLoading}
              onClick={handleExchange}
              size="md"
            >
              Yes, Proceed
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}