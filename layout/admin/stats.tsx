import { currencyFormatter } from "@/utils/currency";

export function Stats() {
  return (
    <section className="grid grid-cols-3 grid-rows-[64px_64px] gap-4 text-sm">
      <div className="row-span-2 flex flex-col justify-center items-center gap-5 bg-gray-30 rounded-[10px]">
        <span>No of Customers</span>
        <span className="text-4xl font-semibold">
          {currencyFormatter(1002)}
        </span>
      </div>
      <div className="bg-[#ECFBFF] rounded-[10px] flex items-center px-5">
        Pending Transfer: <span className="ml-2 font-semibold">102</span>
      </div>
      <div className="bg-[#ECFBFF] rounded-[10px] flex items-center px-5">
        Pending Exchange: <span className="ml-2 font-semibold">1,002</span>
      </div>
      <div className="bg-gray-30 rounded-[10px] flex items-center px-5">
        Total Transfer: <span className="ml-2 font-semibold">1,400</span>
      </div>
      <div className="bg-gray-30 rounded-[10px] flex items-center px-5">
        Total Exchange: <span className="ml-2 font-semibold">1,400</span>
      </div>
    </section>
  );
}
