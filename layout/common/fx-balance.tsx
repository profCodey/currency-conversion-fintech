import { IAccount } from "@/utils/validators/interfaces";
import {
  currencyFormatter,
  getCurrency,
  useCurrencyFlags,
} from "@/utils/currency";
import { EyeClosedIcon, EyeOpenIcon, OptionsIcon } from "@/components/icons";
import { useGetAccounts } from "@/api/hooks/accounts";
import { useGetClientDetails } from "@/api/hooks/user";
import React, { useState } from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FxOptionsModal, NairaOptionsModal } from "./send-fx-modal";
import { Refresh } from "iconsax-react";
import { clsx } from "@mantine/core";
import Cookies from "js-cookie";

export default function FxBalance(props: { wallet: IAccount }) {
  const { wallet } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading: walletsLoading, data: wallets } = useGetAccounts();
  const getIcon = useCurrencyFlags();
  const [seeBalance, setSeeBalance] = useState(false);
  function toggleBalance(fxId: number) {
    setSeeBalance(!seeBalance);
  }

  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
    function getBalanceText(word: any, seeBalance: boolean): string {
    // console.log(word,'word');

    if (+word === 0) {
      return seeBalance ? word : "*********";
    }

    // if (!isNaN(+word)) {
    //   return seeBalance ? word : "*".repeat(word.toString().length);
    // }

    return seeBalance ? word : "*********";
  }
  return (
    <div
      key={wallet.id}
      className="px-4 py-3 bg-white flex flex-col gap-y-4 justify-between rounded-xl border-1 "
      style={{ borderColor: colorSecondary}} 
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-center ">
          <div className="w-[74px] flex items-center gap-1 text-sm font-normal px-2 py-[10px] rounded-xl  border-1 ">
            {getIcon(wallet.currency.code)}
            <span>{wallet.currency.code}</span>
          </div>
          <span role="button" style={{ color: colorSecondary}}  onClick={() => toggleBalance(wallet.id)}>
            {!seeBalance && <EyeClosedIcon />}
            {!!seeBalance && <EyeOpenIcon />}
          </span>
        </div>
       <span style={{ color: colorSecondary }}>
       <button  className="p-0"  onClick={open}>
          <OptionsIcon />
        </button>
       </span>
      </div>
      <span
      style={{ color: colorSecondary}} 
      className=" font-semibold text-xl">
        {getCurrency(wallet.currency.code)}{" "}
        <div className="flex justify-between w-full">
          <div>
            {getBalanceText(
              currencyFormatter(Number(wallet.true_balance)),
              seeBalance
            )}
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => window.location.reload()}>
            <Refresh
              size="20"
              color={colorSecondary}
              variant="Outline"
            />
          </div>
        </div>
      </span>
      {wallet.category === "local" ? (
        <NairaOptionsModal close={close} optionsOpen={opened} id={wallet.id} />
      ) : (
        <FxOptionsModal
          title={wallet.currency.code}
          close={close}
          optionsOpen={opened}
          id={wallet.id}
        />
      )}
    </div>
  );
}
