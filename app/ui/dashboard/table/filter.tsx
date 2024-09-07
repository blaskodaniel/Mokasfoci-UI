import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

export type ColumnFilterType = {
  id: string;
  value: string;
};

const Filter = ({
  columnFilters,
  setColumnFilters,
  columnName,
}: {
  columnFilters: ColumnFilterType[];
  setColumnFilters: Dispatch<SetStateAction<ColumnFilterType[]>>;
  columnName: string;
}) => {
  const filteredValue =
    columnFilters.find((filter) => filter.id === columnName)?.value || "";

  const onFilterChange = (id: string, value: string) => {
    setColumnFilters((prev) =>
      prev.filter((filter) => filter.id !== id).concat({ id, value })
    );
  };

  return (
    <Input
      type="text"
      placeholder={`Search by ${columnName}`}
      className="border border-slate-600 rounded-md p-3 focus:outline-none focus:border-transparent w-70"
      value={filteredValue}
      onChange={(e) => {
        const value = e.target.value;
        onFilterChange(columnName, value);
      }}
    />
  );
};

export default Filter;
