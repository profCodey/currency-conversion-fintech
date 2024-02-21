import { InputHTMLAttributes, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
import Cookies from "js-cookie";
import { FaFilter } from "react-icons/fa6";
import { Button, Group, Menu } from "@mantine/core";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function Table({
  columns,
  data,
  handleDownloadCSV, 
  setSelectedStatus,
  selectedStatus
}: {
  columns: Array<any | false>;
  data: any[];
  handleDownloadCSV?: () => void; 
  setSelectedStatus?: (status: string) => void;
  selectedStatus?: string;
}) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Use the useTable Hook to send the columns and data to build the table
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
  return (
    <section className="flex flex-col gap-4 h-full flex-grow">
      <div className="flex justify-between">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="py-2 px-4 text-lg border outline-primary-70 rounded-md"
          placeholder="Search all columns..."
        />

        <div className="flex gap-3">
      {setSelectedStatus &&
        <Group className="">
      <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button 
        className="font-normal border-2 border-gray-200 hover:bg-[#132144]"
         style={{color:"#000", backgroundColor:"#fff", height:"40px"}}
         leftIcon= {<FaFilter />}
        >Filter By Category</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => { setSelectedStatus && setSelectedStatus("") }}
        >
          All
        </Menu.Item>
        <Menu.Item
          onClick={() => { setSelectedStatus && setSelectedStatus("fx") }}
        >
          FX
        </Menu.Item>
        <Menu.Item
          onClick={() => { setSelectedStatus && setSelectedStatus("local") }}
        >
          Local
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
      </Group> }

        <button
          onClick={handleDownloadCSV}
          style={{backgroundColor:colorBackground}}
          className="hover:bg-[#132144] text-white font-bold py-2 px-4 rounded mr-2"
        >
          Download Excel
        </button>
        </div>
      </div>
      <div className="flex-grow max-h-full overflow-y-auto border">
        <table className="w-full">
          <thead className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-4 px-4 text-xs sm:text-base font-secondary font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="text-xs sm:text-base px-4 py-2 font-primary"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
  
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
