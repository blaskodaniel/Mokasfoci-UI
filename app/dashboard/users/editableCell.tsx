import { Input } from "@/components/ui/input";
import { Column, Row, Table } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { User } from "services/types";

interface ColumnProps {
  getValue: () => any;
  row: Row<User>;
  column: Column<User, unknown>;
  table: Table<User>;
}

const EditableCell = ({ getValue, row, column, table }: ColumnProps) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue || "");

  const onBlur = useCallback(() => {
    table.options.meta?.updateData(row.index, column.id, value);
  }, [column.id, row.index, table.options.meta, value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="w-100">
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
