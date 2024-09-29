"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Group } from "services/types";

interface ColumnProps {
  getValue: () => any;
  row: Row<Group>;
  column: Column<Group, unknown>;
  table: Table<Group>;
}

const DropDownCell = ({ getValue, row, column, table }: ColumnProps) => {
  const wintemid = getValue() || null;
  const teams = table.options.meta?.teams || [];
  const [value, setValue] = useState(wintemid || "");

  const onChange = (e: string | null) => {
    setValue(e);
    table.options.meta?.updateData(row.index, column.id, e);
  };

  useEffect(() => {
    setValue(wintemid);
  }, [wintemid]);

  return (
    <Select defaultValue={wintemid} onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Team name" />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team._id} value={team._id}>
            {team.name}
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button
          className="w-full px-2"
          variant="secondary"
          size="sm"
          onClick={(e) => {
            onChange(null);
          }}
        >
          Clear
        </Button>
      </SelectContent>
    </Select>
  );
};

export default DropDownCell;
