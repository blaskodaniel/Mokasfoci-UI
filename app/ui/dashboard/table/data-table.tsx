"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Team } from "services/types";
import Filter, { ColumnFilterType } from "./filter";
import { MatchStatus, MatchType } from "util/enums";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnIndex: string, value: any) => void;
    teams: Team[];
    matchTypes: String[];
    matchStatuses: String[];
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  teams?: Team[];
  filteredColumnNames?: string[];
}

function DataTable<TData, TValue>({
  data,
  columns,
  teams,
  filteredColumnNames,
}: DataTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [columnFilters, setColumnFilters] = useState<ColumnFilterType[]>([]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      teams: teams || [],
      matchTypes: Object.keys(MatchType),
      matchStatuses: Object.keys(MatchStatus),
      updateData: (rowIndex: number, columnIndex: string, value: any) => {
        console.log("updateData", rowIndex, columnIndex, value);
        setTableData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? { ...prev[rowIndex], [columnIndex]: value }
              : row
          )
        );
      },
    },
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <>
      {filteredColumnNames && filteredColumnNames?.length > 0 && (
        <div className="flex gap-3 mb-4">
          {filteredColumnNames?.map((filter) => {
            return (
              <Filter
                key={filter}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                columnName={filter}
              />
            );
          })}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerName = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      );
                  const headerId =
                    header.getContext().header.id !== "actions"
                      ? header.getContext().header.id
                      : null;

                  return (
                    <TableHead
                      key={header.id}
                      className="bg-[var(--bg-color-second)]"
                    >
                      <div className="flex items-center gap-3">
                        {headerName}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default DataTable;
