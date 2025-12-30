"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column, Row, Table } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { Group, Match, Team } from "services/types";

interface ColumnProps {
  getValue: () => any;
  row: Row<Team>;
  column: Column<Team, unknown>;
  table: Table<Team>;
  data?: any[];
  placeholder?: string;
  property?: string;
}

const DropDownCell = ({
  getValue,
  row,
  column,
  table,
  data = [],
  placeholder = "Please select",
  property,
}: ColumnProps) => {
  const value = getValue() || null;

  const defaultValue = useMemo(
    () => (property && data.length > 0 ? row.getValue(property) : null),
    [property, data.length, row]
  );

  const onChange = (e: string | null) => {
    table.options.meta?.updateData(row.index, column.id, e);
  };

  const renderOptions = useCallback(() => {
    if (data.length > 0) {
      return data.map((d) => (
        <SelectItem key={d.key} value={d.key}>
          {d.value}
        </SelectItem>
      ));
    }
    if (table.options.meta?.groups) {
      return table.options.meta?.groups.map((group) => (
        <SelectItem key={group._id} value={group._id}>
          {group.name}
        </SelectItem>
      ));
    }

    return null;
  }, [table.options.meta?.teams, data]);

  return (
    <Select
      onValueChange={onChange}
      defaultValue={defaultValue?.toString() || value?._id || value?.toString()}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{renderOptions()}</SelectContent>
    </Select>
  );
};

export default DropDownCell;
