import { ReactNode } from "react";

export interface LatestTableColumn<T> {
  header: string;
  render: ((row: T) => ReactNode) | ReactNode;
}

export interface LatestTableProps<T> {
  title: string;
  columns: LatestTableColumn<T>[];
}
