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
  TextInput,
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

interface ExchangeBoxProps {
  gatewayID?: number|undefined;
}

export function ExchangeBox({gatewayID} : ExchangeBoxProps) {
  const {
    isLoading: currenciesLoading,
    currencyOptionsWithId,
    currencyOptions,
  } = useCurrencyOptions();
  const { data: rates, isLoading: ratesLoading } = useGetRates();
  const { data: allAccounts, isLoading: allAccountsLoading } = useGetAccounts();
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

 
  const allAccountsData =
    allAccounts?.data.map((account) => ({
      label: account.label,
      value: account.id.toString(),
      currencyId: account.currency.id.toString(),
      currencyName: account.currency.name,
    })) ?? [];

  let sourceAcc = allAccountsData.find((acc)=> {
    return acc.value == gatewayID?.toString();
  })

  

  // const [sourceAccCurrency, setSourceAccCurrency] = useState("");
  const [destinationAccCurrency, setDestinationAccCurrency] = useState("");
  // const [sourceCurrency, setSourceCurrency] = useState("");
  const [destinationCurrency, setDestinationCurrency] = useState("");

  let sourceCurrency = sourceAcc?.currencyName;
  let sourceAccCurrency = sourceAcc?.currencyId;
  console.log('sourceAcc', sourceAcc, 'sourceCurrency', sourceCurrency, 'sourceAccCurrency', sourceAccCurrency);
  const {
    data: liveRateValue,
    isLoading,
    isError,
  } = useGetLiveRate({
    //@ts-ignore
    source: sourceAccCurrency,
    destination: destinationAccCurrency,
  });
  let liveRate = liveRateValue?.data?.rate;
  const [sourceAccIdValue, setSourceAccIdValue] = useState("");
  const [destinationAccIdValue, setDestinationAccIdValue] = useState("");

  function getCurrencyNameFromId(id: string | null) {
    const currency = currencyOptionsWithId.find(
      (currency) => currency.value === id
    );
    return currency?.label;
  }

  function handleExchangeClick() {
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
      destination_account: Number(destinationAccIdValue),
      source_account: Number(sourceAcc?.value),
    });
  }

 

  return (
    <div className="bg-gray-30 border rounded-lg p-4">
      <Skeleton visible={currenciesLoading || ratesLoading}>
        <section className="bg-white p-4 rounded border flex gap-4">
          {/* <Select
            className="flex-grow"
            label="Source"
            value={currentCurrency.source}
            onChange={(value) => {
              const selectedAcc = allAccountsData.filter(
                (acc) => acc.value === value
              );
              setSourceCurrency(selectedAcc[0].currencyName);
              setSourceAccCurrency(selectedAcc[0].currencyId);
              setSourceAccIdValue(selectedAcc[0].value);
              setCurrentCurrency({
                ...currentCurrency,
                source: value,
              });
            }}
            data={allAccountsData}
            nothingFound={"No currencies found"}
          /> */}

          <TextInput 
            className="flex-grow"
            label="Source"
            value={sourceAcc?.label}
            disabled
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
              const selectedAcc = allAccountsData.filter(
                (acc) => acc.value === value
              );
              setDestinationAccCurrency(selectedAcc[0].currencyId);
              setDestinationCurrency(selectedAcc[0].currencyName);
              setDestinationAccIdValue(selectedAcc[0].value);
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
              <span className="font-semibold">Market Rate:</span> 1{" "}
              {sourceCurrency} = {liveRate || "[Not set]"} {destinationCurrency}
            </>
          )}
        </div>

        <Button
          disabled={!liveRate || !destinationAccCurrency || !sourceAccCurrency}
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
            {sourceCurrency} for{" "}
            <span className="font-medium">
              {currencyFormatter(sourceAmount * liveRate)}{" "}
            </span>{" "}
            {destinationCurrency}
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
