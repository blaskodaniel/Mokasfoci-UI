import { Input } from "@/components/ui/input";
import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface ColumnProps {
  getValue: () => any;
  row: Row<{ key: string; value: any }>;
  column: Column<{ key: string; value: any }, unknown>;
  table: Table<{ key: string; value: any }>;
}

const EditableCell = ({ getValue, row, column, table }: ColumnProps) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue || "");

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

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
