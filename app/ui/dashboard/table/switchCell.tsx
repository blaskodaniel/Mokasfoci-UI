import { Switch } from "@/components/ui/switch";
import { Column, Row, Table } from "@tanstack/react-table";

interface ColumnProps<T> {
  getValue: () => any;
  row: Row<T>;
  column: Column<T, unknown>;
  table: Table<T>;
}

const SwitchCell = <T,>({ getValue, row, column, table }: ColumnProps<T>) => {
  const onChange = (checked: boolean) => {
    table.options.meta?.updateData(row.index, column.id, checked);
  };
  return <Switch checked={getValue()} onCheckedChange={onChange} />;
};

export default SwitchCell;
