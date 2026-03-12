"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Team } from "services/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

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
  },
  {
    accessorKey: "tla",
    header: "TLA",
  },
  {
    accessorKey: "flag",
    header: "Flag",
  },
  {
    accessorKey: "groupid",
    header: "Group",
    cell: ({ row }) => row.original.groupid?.name || "-",
  },
  {
    accessorKey: "win",
    header: "Win",
  },
  {
    accessorKey: "draw",
    header: "Draw",
  },
  {
    accessorKey: "loss",
    header: "Loss",
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    accessorKey: "getgoal",
    header: "Get goals",
  },
  {
    accessorKey: "kickgoal",
    header: "Kick goals",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (row.original.active ? "Igen" : "Nem"),
  },
  {
    accessorKey: "isTournamentWinner",
    header: "Tournament Winner",
    cell: ({ row }) => (row.original.isTournamentWinner ? "Igen" : "Nem"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedRow = row.original;
      if (!isMobile) {
        return (
          <div className="flex gap-3">
            <IoPencilOutline className="cursor-pointer text-blue-500" size={18} onClick={() => onEdit(editedRow)} />
            <IoTrashOutline className="cursor-pointer text-red-500" size={18} onClick={() => onDelete(editedRow._id)} />
          </div>
        );
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <BiDotsHorizontalRounded className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(editedRow)}>Szerkesztés</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(editedRow._id)}>Törlés</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
