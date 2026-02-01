import { Input } from "@/components/ui/input";
import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MatchTableItem } from "./types";

interface ColumnProps {
  getValue: () => any;
  row: Row<MatchTableItem>;
  column: Column<MatchTableItem, unknown>;
  table: Table<MatchTableItem>;
  width?: string;
}

const EditableCell = ({ getValue, row, column, table, width }: ColumnProps) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue || "");

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={width || "w-100"}>
      <Input
        className="text-center"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={onBlur}
      />
    </div>
  );
};

export default EditableCell;
