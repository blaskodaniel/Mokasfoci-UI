import { Switch } from "@/components/ui/switch";
import { ColumnProps } from "./types";

const SwitchCell = <T,>({ getValue, row, column, table }: ColumnProps<T>) => {
  const onChange = (checked: boolean) => {
    table.options.meta?.updateData(row.index, column.id, checked);
  };
  return <Switch checked={getValue()} onCheckedChange={onChange} />;
};

export default SwitchCell;
