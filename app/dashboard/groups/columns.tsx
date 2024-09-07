"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Group } from "services/types";
import EditableCell from "./editableCell";
import DropDownCell from "./dropDownCell";

interface IGroupColumnProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GroupColumns = ({
  onEdit,
  onDelete,
}: IGroupColumnProps): ColumnDef<Group>[] => [
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
    accessorKey: "winteamid",
    header: "WinTeam ID",
    cell: DropDownCell,
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
