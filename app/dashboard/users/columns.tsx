"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Team, User } from "services/types";
import DesktopActions from "@ui/dashboard/table/desktop-actions";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import DropDownCell from "./dropDownCell";
import { Roles } from "util/enums";
import { mapEnumToObjectArray } from "util/commons";
import { AvatarImg } from "@ui/global/CommonStyles";
import EditableCell from "./editableCell";

interface IUsersColumnProps {
  onEdit: (team: User) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const UsersColumns = ({
  onEdit,
  onDelete,
  isMobile,
}: IUsersColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const { avatar } = row.original;
      return (
        <div className="flex items-center justify-center">
          <AvatarImg src="/avatar.png" alt="" width={40} height={40} />
        </div>
      );
    },
  },
  {
    accessorKey: "_id",
    header: () => <div className="text-left">ID</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: EditableCell,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: EditableCell,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: EditableCell,
  },
  {
    accessorKey: "publicId",
    header: "PublicId",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorFn: (row) => row.data.availableScore,
    id: "data.availableScore",
    header: "Available",
    cell: EditableCell,
  },
  {
    accessorFn: (row) => row.data.profitScore,
    id: "data.profitScore",
    header: "Profit",
    cell: EditableCell,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue, row, column, table }) =>
      DropDownCell({
        getValue,
        row,
        column,
        table,
        data: mapEnumToObjectArray(Roles),
        property: "role",
      }),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedRow = row.original;
      if (!isMobile) {
        return (
          <DesktopActions
            onEdit={onEdit}
            onDelete={(row) => onDelete(row._id)}
            rowData={editedRow}
          />
        );
      }
      return (
        <MobileActions
          onEdit={onEdit}
          onDelete={(row) => onDelete(row._id)}
          rowData={editedRow}
        />
      );
    },
  },
];
