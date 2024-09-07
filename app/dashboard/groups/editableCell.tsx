import { Input } from "@/components/ui/input";
import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Group } from "services/types";

interface ColumnProps {
  getValue: () => any;
  row: Row<Group>;
  column: Column<Group, unknown>;
  table: Table<Group>;
}

const EditableCell = ({ getValue, row, column, table }: ColumnProps) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

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
        name="editedGroupName"
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
