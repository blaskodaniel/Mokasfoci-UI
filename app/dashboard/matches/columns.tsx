"use client";

import { ColumnDef } from "@tanstack/react-table";
import DropDownCell from "./dropDownCell";
import EditableCell from "./editableCell";
import { MatchOutcome, MatchStatus, MatchType } from "util/enums";
import DatePickerCell from "@ui/dashboard/table/datePickerCell";
import { mapEnumToObjectArray } from "util/commons";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import SwitchCell from "@ui/dashboard/table/switchCell";
import { MatchTableItem } from "./types";
import { FaRegCheckCircle } from "react-icons/fa";

interface IMatchColumnProps {
  onEdit: (match: MatchTableItem) => void;
  onDelete: (id: string) => void;
  onCalculation?: (match: MatchTableItem) => void;
  onRevertCalculation?: (match: MatchTableItem) => void;
  isMobile: boolean;
}

export const MatchColumns = ({
  onEdit,
  onDelete,
  onCalculation,
  onRevertCalculation,
  isMobile,
}: IMatchColumnProps): ColumnDef<MatchTableItem>[] => [
  {
    accessorKey: "schedulerStatus",
    header: "",
    cell: ({ getValue, row }) => {
      const status = getValue() as MatchTableItem["schedulerStatus"];
      if(row.original.status === MatchStatus.finished){
        return <FaRegCheckCircle className="text-green-500" size={20} />;
      }
      if(row.original.status === MatchStatus.playing){
        return (
          <span className="w-4 h-4 inline-block rounded-full bg-red-500 animate-pulse" />
        );
      }
      if (status) {
        return (
          <span className="w-4 h-4 inline-block rounded-full bg-yellow-500 animate-pulse" />
        );
      }
      return null;
    },
  },
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
    header: "1",
    cell: EditableCell,
  },
  {
    accessorKey: "oddsDraw",
    header: "X",
    cell: EditableCell,
  },
  {
    accessorKey: "oddsBwin",
    header: "2",
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
      const props = {
        onEdit,
        onDelete: (row: MatchTableItem) => onDelete(row._id),
        ...(editedMatch.isCalculated ? { onRevertCalculation } : { onCalculation }),
        rowData: editedMatch,
      }
      /* if (!isMobile) {
        return (
          <DesktopActions
            {...props}
          />
        );
      } */
      return (
        <MobileActions
          {...props}
        />
      );
    },
  },
];
