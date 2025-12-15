"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowData,
  useReactTable,
  VisibilityState,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HiOutlinePlus } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Team } from "services/types";
import Filter, { ColumnFilterType } from "./filter";
import { MatchStatus, MatchType } from "util/enums";
import { Button } from "@/components/ui/button";
import HideColumnsDropdown from "./hideColumnsDropdown";
import AddButton from "./add-button";

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
  hideColumns?: Record<string, boolean>;
  onOpenDialog?: () => void;
}

function DataTable<TData, TValue>({
  data,
  columns,
  teams,
  filteredColumnNames,
  hideColumns,
  onOpenDialog,
}: DataTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    ...hideColumns,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFilterType[]>([]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      columnFilters,
      columnVisibility,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    meta: {
      teams: teams || [],
      matchTypes: Object.keys(MatchType),
      matchStatuses: Object.keys(MatchStatus),
      updateData: (rowIndex: number, columnIndex: string, value: any) => {
        if (columnIndex.split(".").length > 1) {
          const [first, second] = columnIndex.split(".");
          setTableData((prev) =>
            prev.map((row, index) =>
              index === rowIndex
                ? {
                    ...prev[rowIndex],
                    [first]: {
                      ...(prev as any)[rowIndex][first],
                      [second]: value,
                    },
                  }
                : row
            )
          );
        } else {
          setTableData((prev) =>
            prev.map((row, index) =>
              index === rowIndex
                ? { ...prev[rowIndex], [columnIndex]: value }
                : row
            )
          );
        }
      },
    },
  });

  const onDialog = () => {
    onOpenDialog && onOpenDialog();
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <>
      {filteredColumnNames && filteredColumnNames?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
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

          <HideColumnsDropdown table={table} />
          {onOpenDialog && <AddButton onDialog={onDialog} />}
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
