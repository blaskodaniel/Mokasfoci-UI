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
import { Match, Team } from "services/types";

interface ColumnProps {
  getValue: () => any;
  row: Row<Match>;
  column: Column<Match, unknown>;
  table: Table<Match>;
  data?: any[];
  property?: string;
}

const DropDownCell = ({
  getValue,
  row,
  column,
  table,
  data = [],
  property,
}: ColumnProps) => {
  const team = getValue() || null;
  const defaultValue = useMemo(
    () => (property && data.length > 0 ? row.getValue(property) : null),
    [property, data.length, row]
  );

  const renderOptions = useCallback(() => {
    if (data.length > 0) {
      return data.map((d, i) => (
        <SelectItem key={i} value={d}>
          {d}
        </SelectItem>
      ));
    }
    if (table.options.meta?.teams) {
      return table.options.meta?.teams.map((team) => (
        <SelectItem key={team._id} value={team._id}>
          {team.name}
        </SelectItem>
      ));
    }

    return null;
  }, [table.options.meta?.teams, data]);

  return (
    <Select defaultValue={defaultValue || team._id}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Team name" />
      </SelectTrigger>
      <SelectContent>{renderOptions()}</SelectContent>
    </Select>
  );
};

export default DropDownCell;
