import {
  CircleBritishFlag,
  CircleEuropeFlag,
  CircleNigerianFlag,
  CircleUsFlag,
} from "@/components/icons";

export function Wallets() {
  return (
    <div className="py-6 px-5 bg-gray-30 rounded-lg border font-semibold flex flex-col gap-4">
      <section className="flex justify-between text-primary-70 text-sm">
        <span>Wallet Balance</span>
        <span>Hide balance</span>
      </section>

      <section className="grid grid-cols-2 grid-rows-[repeat(2,_minmax(4rem,_auto))] gap-4">
        <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
          <span>£0.00</span>
          <CircleBritishFlag />
        </div>
        <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
          <span>€0.00</span>
          <CircleEuropeFlag />
        </div>
        <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
          <span>$0.00</span>
          <CircleUsFlag />
        </div>
        <div className="px-4 py-3 bg-white flex items-center justify-between rounded-md border">
          <span>₦0.00</span>
          <CircleNigerianFlag />
        </div>
      </section>
    </div>
  );
}
