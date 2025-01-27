import { Column, Row, Table } from "@tanstack/react-table";

export interface ColumnProps<T> {
  getValue: () => any;
  row: Row<T>;
  column: Column<T, unknown>;
  table: Table<T>;
}
