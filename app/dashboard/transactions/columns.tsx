"use client";

import { ColumnDef } from "@tanstack/react-table";
import MobileActions from "@ui/dashboard/table/mobile-actions";
import DesktopActions from "@ui/dashboard/table/desktop-actions";
import EditableCell from "../coupons/editableCell";
import { Coupon, Transaction } from "services/types";
import { mapEnumToObjectArray } from "util/commons";
import { CouponStatus, CouponType } from "util/enums";
import DropDownCell from "../coupons/dropDownCell";

interface ITransactionsColumnProps {
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const TransactionsColumns = ({
  onEdit,
  onDelete,
  isMobile,
}: ITransactionsColumnProps): ColumnDef<Transaction>[] => [
  {
    accessorKey: "_id",
    header: () => <div className="text-left">ID</div>,
  },
  {
    accessorKey: "match",
    header: "Match",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.matchid?.teamA?.name} -{" "}
          {row.original.matchid?.teamB?.name}
        </div>
      );
    },
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
