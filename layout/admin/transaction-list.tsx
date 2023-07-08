import {
  ActionIcon,
  Group,
  TextInput,
} from "@mantine/core";
import SearchIcon from "@/public/search.svg";
import { ManualFundingHistory } from "../transactions/manual-funding";

export function TransactionsList() {
  
  return (
    <section>
      <div className="flex justify-between">
        <form>
          <Group>
            <TextInput placeholder="Search user" size="lg" radius={100} />
            <ActionIcon
              radius={100}
              variant="filled"
              className="bg-accent hover:bg-accent"
              size="xl"
            >
              <SearchIcon />
            </ActionIcon>
          </Group>
        </form>
      </div>
      <ManualFundingHistory />
    </section>
  );
}
