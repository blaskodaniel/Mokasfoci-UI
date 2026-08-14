"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "services/types";
import { useDialog } from "store/useDialog";
import { TransactionsColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { gameService } from "services/services";
import { SortOrder } from "util/enums";
import { Button } from "@/components/ui/button";
import { IoSearchOutline } from "react-icons/io5";
import CreateTransactionDialog from "./createDialog";

const TransactionTable = () => {
  const { onOpen } = useDialog();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(20);

  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: transactionsLoading,
    refetch: transactionsRefetch,
  } = useQuery({
    queryKey: ["transactions", currentPage, size, searchTerm],
    queryFn: () =>
      gameService
        .getAllTransactions({
          page: currentPage + 1,
          limit: size,
          sort: "date",
          order: SortOrder.desc,
          search: searchTerm,
        })
        .then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const columns = useMemo(() => TransactionsColumns(), []);

  const transactions = useMemo(() => {
    return transactionsData?.data?.items || [];
  }, [transactionsData]);

  const { limit, page, total } = useMemo(() => {
    return transactionsData?.data || { limit: 10, page: 1, total: 0 };
  }, [transactionsData]);

  const totalPages = Math.ceil(total / limit);

  if (transactionsLoading) {
    return <div>Loading...</div>;
  }

  if (transactionsError && Object.keys(transactionsError).length > 0) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <h1 className={PageTitle}>Játékosok fogadásai</h1>

      {/* Search input */}
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Keresés username, csapatnév, dátum vagy státusz alapján..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          className="bg-emerald-700 hover:bg-emerald-600"
          variant="outline"
          onClick={() => {
            setCurrentPage(0);
            transactionsRefetch();
          }}
        >
          <IoSearchOutline className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      <div className="py-5">
        <DataTable
          data={transactions as Transaction[]}
          columns={columns}
          onOpenDialog={onOpen}
          enablePagination={true}
          manualPagination={true}
          pageSize={size}
          totalCount={total}
          pageCount={totalPages}
          onPaginationChange={(pageIndex, pageSize) => {
            setCurrentPage(pageIndex);
            setSize(pageSize);
          }}
        />
        <CreateTransactionDialog />
      </div>
    </>
  );
};

export default TransactionTable;
