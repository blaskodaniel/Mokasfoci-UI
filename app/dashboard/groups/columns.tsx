"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Group } from "services/types";
import EditableCell from "./editableCell";
import DropDownCell from "./dropDownCell";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import DesktopActions from "@ui/dashboard/table/desktop-actions";

interface IGroupColumnProps {
  onEdit: (group: Group) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const GroupColumns = ({ onEdit, onDelete, isMobile }: IGroupColumnProps): ColumnDef<Group>[] => [
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
    accessorKey: "groupWinnerId",
    header: "WinTeam ID",
    cell: DropDownCell,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedGroup = row.original;
      if (!isMobile) {
        return <DesktopActions onEdit={onEdit} onDelete={(row) => onDelete(row._id)} rowData={editedGroup} />;
      }
      return <MobileActions onEdit={onEdit} onDelete={(row) => onDelete(row._id)} rowData={editedGroup} />;
    },
  },
];
