import { useGetFxSummary } from "@/api/hooks/admin/fx";
import { useUsersList } from "@/api/hooks/admin/users";
import { USER_CATEGORIES } from "@/utils/constants";
import { currencyFormatter } from "@/utils/currency";
import { Skeleton } from "@mantine/core";
import { useMemo } from "react";

export function Stats() {
  const { data: fxSummary, isLoading } = useGetFxSummary();
  const { data, isLoading: usersLoading } = useUsersList();

  const numberOfCustomers = useMemo(
    function () {
      return (
        data?.data.filter((user) => user.category !== USER_CATEGORIES.ADMIN)
          .length || 0
      );
    },
    [data?.data]
  );

  return (
    <section className="grid grid-cols-3 gap-4 text-sm grid-rows-[140px]">
      {/* <section className="grid grid-cols-3 grid-rows-[64px_64px] gap-4 text-sm"> */}
      <Skeleton visible={usersLoading}>
        <div className="flex flex-col justify-center items-center gap-5 bg-gray-30 rounded-[10px] border h-full">
          <span>No of Customers</span>
          <span className="text-4xl font-semibold font-secondary">
            {currencyFormatter(numberOfCustomers)}
          </span>
        </div>
      </Skeleton>
      {/* <div className="bg-[#ECFBFF] rounded-[10px] flex items-center px-5">
          Pending Transfer: <span className="ml-2 font-semibold">102</span>
        </div> */}
      <Skeleton visible={isLoading}>
        <div className="bg-[#ECFBFF] rounded-[10px] flex flex-col gap-5 justify-center items-center px-5 h-full border">
          <span>Pending Exchange:</span>
          <span className="text-4xl font-semibold font-secondary">
            {currencyFormatter(Number(fxSummary?.data.pending))}
          </span>
        </div>
      </Skeleton>
      {/* <div className="bg-gray-30 rounded-[10px] flex items-center px-5">
          Total Transfer: <span className="ml-2 font-semibold">1,400</span>
        </div> */}
      <Skeleton visible={isLoading}>
        <div className="bg-[#ECFBFF] rounded-[10px] flex flex-col gap-5 justify-center items-center px-5 h-full border">
          <span>Total Exchange:</span>
          <span className="text-4xl font-semibold font-secondary">
            {currencyFormatter(Number(fxSummary?.data.approved))}
          </span>
        </div>
      </Skeleton>
    </section>
  );
}
