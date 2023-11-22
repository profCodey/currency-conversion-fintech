import { useGetFxSummary } from "@/api/hooks/admin/fx";
import { useUsersList } from "@/api/hooks/admin/users";
import { USER_CATEGORIES } from "@/utils/constants";
import { currencyFormatter } from "@/utils/currency";
import { Skeleton } from "@mantine/core";
import { useMemo } from "react";
import Cookies from "js-cookie";

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

      //ts-ignore 
      let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
      let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
      let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

  return (
    <section className="grid grid-cols-3 gap-4 text-sm grid-rows-[140px]">
      {/* <section className="grid grid-cols-3 grid-rows-[64px_64px] gap-4 text-sm"> */}
      <Skeleton visible={usersLoading}>
        <div 
        style={{backgroundColor:colorSecondary}}
        className="flex flex-col justify-center items-center gap-5 rounded-[10px] border h-full">
          <span
          style={{color:colorPrimary}}
          >No of Customers</span>
          <span 
           style={{color:colorPrimary}}
          className="text-4xl font-semibold font-secondary">
            {currencyFormatter(numberOfCustomers)}
          </span>
        </div>
      </Skeleton>
      {/* <div className="bg-[#ECFBFF] rounded-[10px] flex items-center px-5">
          Pending Transfer: <span className="ml-2 font-semibold">102</span>
        </div> */}
      <Skeleton visible={isLoading}>
        <div 
        style={{backgroundColor:colorSecondary}}
        className=" rounded-[10px] flex flex-col gap-5 justify-center items-center px-5 h-full border">
          <span
           style={{color:colorPrimary}}>Pending Exchange:</span>
          <span 
           style={{color:colorPrimary}}
          className="text-4xl font-semibold font-secondary">
            {currencyFormatter(Number(fxSummary?.data.pending))}
          </span>
        </div>
      </Skeleton>
      {/* <div className="bg-gray-30 rounded-[10px] flex items-center px-5">
          Total Transfer: <span className="ml-2 font-semibold">1,400</span>
        </div> */}
      <Skeleton visible={isLoading}>
        <div 
        style={{backgroundColor:colorSecondary}}
        className=" rounded-[10px] flex flex-col gap-5 justify-center items-center px-5 h-full border">
          <span
           style={{color:colorPrimary}}
          >Total Exchange:</span>
          <span 
           style={{color:colorPrimary}}
          className="text-4xl font-semibold font-secondary">
            {currencyFormatter(Number(fxSummary?.data.approved))}
          </span>
        </div>
      </Skeleton>
    </section>
  );
}
