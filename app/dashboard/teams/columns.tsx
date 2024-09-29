"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Team } from "services/types";
import EditableCell from "./editableCell";
import SwitchCell from "@ui/dashboard/table/switchCell";

interface ITeamColumnProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TeamColumns = ({
  onEdit,
  onDelete,
}: ITeamColumnProps): ColumnDef<Team>[] => [
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
    accessorKey: "flag",
    header: "Flag",
    cell: EditableCell,
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
              onEdit(group._id);
            }}
          >
            Save
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(group._id);
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
