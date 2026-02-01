"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Team } from "services/types";
import EditableCell from "./editableCell";
import SwitchCell from "@ui/dashboard/table/switchCell";
import DesktopActions from "@ui/dashboard/table/desktop-actions";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import DropDownCell from "./dropDownCell";

interface ITeamColumnProps {
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const TeamColumns = ({ onEdit, onDelete, isMobile }: ITeamColumnProps): ColumnDef<Team>[] => [
  {
    accessorKey: "_id",
    header: () => <div className="text-left">ID</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: EditableCell,
  },
  {
    accessorKey: "tla",
    header: "TLA",
    cell: EditableCell,
  },
  {
    accessorKey: "flag",
    header: "Flag",
    cell: EditableCell,
  },
  {
    accessorKey: "groupid",
    header: "GroupId",
    cell: DropDownCell,
  },
  {
    accessorKey: "win",
    header: "Win",
    cell: EditableCell,
  },
  {
    accessorKey: "draw",
    header: "Draw",
    cell: EditableCell,
  },
  {
    accessorKey: "loss",
    header: "Loss",
    cell: EditableCell,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: EditableCell,
  },
  {
    accessorKey: "getgoal",
    header: "Get goals",
    cell: EditableCell,
  },
  {
    accessorKey: "kickgoal",
    header: "Kick goals",
    cell: EditableCell,
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: SwitchCell,
  },
  {
    accessorKey: "isTournamentWinner",
    header: "Tournament Winner",
    cell: SwitchCell,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedRow = row.original;
      if (!isMobile) {
        return <DesktopActions onEdit={onEdit} onDelete={(row) => onDelete(row._id)} rowData={editedRow} />;
      }
      return <MobileActions onEdit={onEdit} onDelete={(row) => onDelete(row._id)} rowData={editedRow} />;
    },
  },
];
