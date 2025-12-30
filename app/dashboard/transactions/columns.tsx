"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "services/types";


export const TransactionsColumns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: "_id",
    header: () => <div className="text-left">ID</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return <div>{row.original.userid?.username}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <div>{row.original.amount}</div>;
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      return <div>{row.original.comment}</div>;
    },
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

];
