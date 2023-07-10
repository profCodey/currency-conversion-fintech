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

export function ExchangeBox() {
  const { isLoading: currenciesLoading, currencyOptionsWithId } =
    useCurrencyOptions();
  const { data: rates, isLoading: ratesLoading } = useGetRates();
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

  const matchedRate = useCallback(
    function () {
      const rate = rates?.data
        .filter((rate) => rate.is_active)
        .find(function (rate) {
          return (
            rate.destination_currency.toString() ===
              currentCurrency.destination &&
            rate.source_currency.toString() === currentCurrency.source
          );
        });
      return rate;
    },
    [currentCurrency.destination, currentCurrency.source, rates?.data]
  );

  const rateFactor = matchedRate()?.rate || 1;
  const destinationAmount = sourceAmount * Number(rateFactor);

  function getCurrencyNameFromId(id: string | null) {
    const currency = currencyOptionsWithId.find(
      (currency) => currency.value === id
    );
    return currency?.label;
  }

  function handleExchange() {
    exchange({
      amount: sourceAmount.toString(),
      destination_account: Number(currentCurrency.destination),
      source_account: Number(currentCurrency.source),
    });
  }

  const rate = matchedRate()?.rate;
  return (
    <div className="bg-gray-30 border rounded-lg p-4">
      <Skeleton visible={currenciesLoading || ratesLoading}>
        <section className="bg-white p-4 rounded border flex gap-4">
          <Select
            className="flex-grow"
            label="Currency"
            value={currentCurrency.source}
            onChange={(value) => {
              setCurrentCurrency({
                ...currentCurrency,
                source: value,
              });
            }}
            data={currencyOptionsWithId}
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
            label="Currency"
            value={currentCurrency.destination}
            onChange={(value) => {
              setCurrentCurrency({
                ...currentCurrency,
                destination: value,
              });
            }}
            data={currencyOptionsWithId}
          />
          <NumberInput
            className="flex-grow"
            label="You receive"
            disabled
            //   parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            value={destinationAmount}
          />
        </section>

        <div className="text-primary-70 text-center my-5 text-sm">
          <span className="font-semibold">Market Rate:</span> 1{" "}
          {getCurrencyNameFromId(currentCurrency.source)} ={" "}
          {matchedRate()?.rate || "[Not set]"}{" "}
          {getCurrencyNameFromId(currentCurrency.destination)}
        </div>
        <Button
          disabled={!rate}
          className="bg-accent hover:bg-accent"
          size="md"
          fullWidth
          onClick={() => setShowConfirmationModal(true)}
        >
          Exchange
        </Button>

        {!matchedRate()?.rate && (
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
            {getCurrencyNameFromId(currentCurrency.source)} for{" "}
            <span className="font-medium">
              {currencyFormatter(destinationAmount)}{" "}
            </span>{" "}
            {getCurrencyNameFromId(currentCurrency.destination)}
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
