"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Match } from "services/types";
import DropDownCell from "./dropDownCell";
import EditableCell from "./editableCell";
import { Button } from "@/components/ui/button";
import { MatchOutcome, MatchStatus, MatchType } from "util/enums";
import DatePickerCell from "@ui/dashboard/table/datePickerCell";
import { mapEnumToObjectArray } from "util/commons";
import DesktopActions from "@ui/dashboard/table/desktop-actions";
import MobileActions from "@ui/dashboard/table/mobile-actions";

interface IMatchColumnProps {
  onEdit: (match: Match) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const MatchColumns = ({
  onEdit,
  onDelete,
  isMobile,
}: IMatchColumnProps): ColumnDef<Match>[] => [
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
        data: mapEnumToObjectArray(MatchType),
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
        data: mapEnumToObjectArray(MatchStatus),
        property: "status",
      }),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: DatePickerCell,
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    cell: ({ getValue, row, column, table }) =>
      DropDownCell({
        getValue,
        row,
        column,
        table,
        data: mapEnumToObjectArray(MatchOutcome),
        property: "outcome",
      }),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedMatch = row.original;
      if (!isMobile) {
        return (
          <DesktopActions
            onEdit={onEdit}
            onDelete={(row) => onDelete(row._id)}
            rowData={editedMatch}
          />
        );
      }
      return (
        <MobileActions
          onEdit={onEdit}
          onDelete={(row) => onDelete(row._id)}
          rowData={editedMatch}
        />
      );
    },
  },
];
