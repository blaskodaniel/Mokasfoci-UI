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
import SwitchCell from "@ui/dashboard/table/switchCell";

interface IMatchColumnProps {
  onEdit: (match: Match) => void;
  onDelete: (id: string) => void;
  onCalculation?: (match: Match) => void;
  isMobile: boolean;
}

export const MatchColumns = ({
  onEdit,
  onDelete,
  onCalculation,
  isMobile,
}: IMatchColumnProps): ColumnDef<Match>[] => [
  {
    accessorKey: "teamA",
    header: "Team A",
    cell: DropDownCell,
  },
  {
    accessorKey: "goalA",
    header: "Goals A",
    cell: EditableCell,
  },
  {
    accessorKey: "goalB",
    header: "Goals B",
    cell: EditableCell,
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
    accessorKey: "isCalculated",
    header: "Is Calculated",
    cell: SwitchCell,
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
      console.log("editedMatch: ", editedMatch.isCalculated);
      const props = {
        onEdit,
        onDelete: (row: Match) => onDelete(row._id),
        rowData: editedMatch,
        ...(!editedMatch.isCalculated && { onCalculation }),
      }
      if (!isMobile) {
        return (
          <DesktopActions
            {...props}
          />
        );
      }
      return (
        <MobileActions
          {...props}
        />
      );
    },
  },
];
