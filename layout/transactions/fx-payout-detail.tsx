import { IFxPayout } from "@/utils/validators/interfaces";
import { Drawer, List } from "@mantine/core";
import { Information } from "iconsax-react";

export function FxPayoutDetail({
  open,
  payout,
  closeDrawer,
}: {
  open: boolean;
  payout: IFxPayout | null;
  closeDrawer(): void;
}) {
  return (
    <Drawer
      title="Payout detail"
      position="right"
      opened={open}
      onClose={closeDrawer}
    >
      <List spacing="md" size="md" center icon={<Information size={16} />}>
        <Detail title="Account name" content={payout?.account_name} />
        <Detail title="Account number" content={payout?.account_number} />
        <Detail title="Amount" content={payout?.amount} />
        <Detail title="BIC" content={payout?.bic} />
        <Detail title="IBAN" content={payout?.iban} />
        <Detail title="Created by" content={payout?.created_by_name} />
        <Detail title="Date created" content={payout?.created_on} />
        <Detail title="Sort code" content={payout?.sort_code} />
        <Detail title="Zip code" content={payout?.zipcode} />
        <Detail title="Narration" content={payout?.narration} />
        <Detail title="Admin remarks" content={payout?.admin_remarks} />
        <Detail title="Recipient address" content={payout?.recipient_address} />
        <Detail title="State" content={payout?.state} />
        <Detail title="City" content={payout?.city} />
        <Detail title="Reference" content={payout?.reference} />
      </List>
    </Drawer>
  );
}

function Detail({
  title,
  content,
}: {
  title: string;
  content: string | number | undefined;
}) {
  return (
    <List.Item>
      <span className="font-semibold">{title}:</span>
      <span className="">{content || "Nil"}</span>
    </List.Item>
  );
}
