import { ActionIcon, Group, TextInput } from "@mantine/core";
import SearchIcon from "@/public/search.svg";
import { ManualFundingHistory } from "../transactions/manual-funding";

export function TransactionsList() {
  return (
    <section className="flex-grow flex flex-col">
      <ManualFundingHistory adminCategory={true}/>
    </section>
  );
}
