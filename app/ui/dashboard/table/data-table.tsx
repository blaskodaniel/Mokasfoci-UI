"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
  VisibilityState,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HiOutlinePlus } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Group, Team } from "services/types";
import Filter, { ColumnFilterType } from "./filter";
import { MatchStatus, MatchType } from "util/enums";
import { Button } from "@/components/ui/button";
import HideColumnsDropdown from "./hideColumnsDropdown";
import AddButton from "./add-button";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnIndex: string, value: any) => void;
    teams?: Team[];
    groups?: Group[];
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  teams?: Team[];
  groups?: Group[];
  filteredColumnNames?: string[];
  hideColumns?: Record<string, boolean>;
  onOpenDialog?: () => void;
  enablePagination?: boolean;
  pageSize?: number;
  manualPagination?: boolean;
  totalCount?: number;
  pageCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

function DataTable<TData, TValue>({
  data,
  columns,
  teams,
  groups,
  filteredColumnNames,
  hideColumns,
  onOpenDialog,
  enablePagination = false,
  pageSize = 10,
  manualPagination = false,
  totalCount,
  pageCount,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    ...hideColumns,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFilterType[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      columnFilters,
      columnVisibility,
      sorting,
      pagination,
    },
    pageCount: manualPagination ? pageCount : undefined,
    manualPagination,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    meta: {
      teams: teams || [],
      groups: groups || [],
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
                : row,
            ),
          );
        } else {
          setTableData((prev) =>
            prev.map((row, index) => (index === rowIndex ? { ...prev[rowIndex], [columnIndex]: value } : row)),
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

  useEffect(() => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange(pagination.pageIndex, pagination.pageSize);
    }
  }, [pagination.pageIndex, pagination.pageSize, manualPagination, onPaginationChange]);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        {filteredColumnNames &&
          filteredColumnNames?.length > 0 &&
          filteredColumnNames?.map((filter) => {
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerName = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext());
                  const headerId = header.getContext().header.id !== "actions" ? header.getContext().header.id : null;

                  return (
                    <TableHead key={header.id} className="bg-[var(--bg-color-second)]">
                      <div className="flex items-center gap-3">{headerName}</div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                manualPagination ? (totalCount ?? 0) : table.getFilteredRowModel().rows.length,
              )}{" "}
              of {manualPagination ? (totalCount ?? 0) : table.getFilteredRowModel().rows.length}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>«
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>‹
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>›
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>»
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DataTable;
