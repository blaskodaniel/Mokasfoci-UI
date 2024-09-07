"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Match } from "services/types";
import DropDownCell from "./dropDownCell";
import EditableCell from "./editableCell";
import { Button } from "@/components/ui/button";
import { MatchStatus, MatchType } from "util/enums";

export const MatchColumns: ColumnDef<Match>[] = [
  {
    accessorKey: "teamA",
    header: "Team A",
    cell: DropDownCell,
  },
  {
    accessorKey: "teamB",
    header: "Team B",
    cell: DropDownCell,
  },
  {
    accessorKey: "oddsAwin",
    header: "Team A Odds",
    cell: EditableCell,
  },
  {
    accessorKey: "oddsDraw",
    header: "Draw Odds",
    cell: EditableCell,
  },
  {
    accessorKey: "oddsBwin",
    header: "Team B Odds",
    cell: EditableCell,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue, row, column, table }) =>
      DropDownCell({
        getValue,
        row,
        column,
        table,
        data: Object.keys(MatchType),
        property: "type",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue, row, column, table }) =>
      DropDownCell({
        getValue,
        row,
        column,
        table,
        data: Object.keys(MatchStatus),
        property: "status",
      }),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: EditableCell,
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    cell: EditableCell,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const group = row.original;

      return (
        <div className="flex space-x-2 justify-end">
          <Button
            color="primary"
            variant="outline"
            onClick={() => {
              console.log("Edit group", group);
            }}
          >
            Save
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              console.log("Delete group", group);
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
