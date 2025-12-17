"use client";

import { ColumnDef } from "@tanstack/react-table";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import DesktopActions from "@ui/dashboard/table/desktop-actions";
import EditableCell from "./editableCell";
import { Coupon } from "services/types";
import { mapEnumToObjectArray } from "util/commons";
import { CouponStatus, CouponType } from "util/enums";
import DropDownCell from "./dropDownCell";

interface ICouponColumnProps {
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const CouponColumns = ({
  onEdit,
  onDelete,
  isMobile,
}: ICouponColumnProps): ColumnDef<Coupon>[] => [
  {
    accessorKey: "_id",
    header: () => <div className="text-left">ID</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return <div>{row.original.userid.username}</div>;
    },
  },
  {
    accessorKey: "match",
    header: "Match",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.matchid.teamA?.name} -{" "}
          {row.original.matchid.teamB?.name}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: EditableCell,
  },
  {
    accessorKey: "odds",
    header: "Odds",
    cell: EditableCell,
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    cell: EditableCell,
  },
  {
    accessorKey: "success",
    header: "Success",
    cell: EditableCell,
  },
  {
    accessorKey: "totalWin",
    header: "Win",
    cell: EditableCell,
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
        data: mapEnumToObjectArray(CouponStatus),
        property: "status",
      }),
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
        data: mapEnumToObjectArray(CouponType),
        property: "type",
      }),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <div>{row.original.date}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const editedGroup = row.original;
      if (!isMobile) {
        return (
          <DesktopActions
            onEdit={onEdit}
            onDelete={(row) => onDelete(row._id)}
            rowData={editedGroup}
          />
        );
      }
      return (
        <MobileActions
          onEdit={onEdit}
          onDelete={(row) => onDelete(row._id)}
          rowData={editedGroup}
        />
      );
    },
  },
];
