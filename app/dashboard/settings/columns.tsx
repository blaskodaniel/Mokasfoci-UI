"use client";

import { ColumnDef } from "@tanstack/react-table";
import DesktopActions from "@ui/dashboard/table/desktop-actions";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import EditableCell from "./editableCell";

interface IConfigColumnProps {
  onEdit: (row: { key: string; value: any }) => void;
  isMobile: boolean;
}

export const ConfigColumns = ({
  onEdit,
  isMobile,
}: IConfigColumnProps): ColumnDef<{ key: string; value: any }>[] => [
  {
    accessorKey: "key",
    header: "Config",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: EditableCell,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedRow = row.original;

      if (!isMobile) {
        return <DesktopActions onEdit={onEdit} rowData={editedRow} />;
      }
      return <MobileActions onEdit={onEdit} rowData={editedRow} />;
    },
  },
];
