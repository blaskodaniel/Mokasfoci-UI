"use client";

import { useCallback, useMemo, useState } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Coupon, Group, Team, Transaction } from "services/types";
import { useDialog } from "store/useDialog";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import { TransactionsColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { DeleteCouponAction, updateCouponAction } from "services/actions";
import { gameService } from "services/services";
import { SortOrder } from "util/enums";

const TransactionTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames: string[];
}) => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { onOpen } = useDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: transactionsLoading,
    refetch: transactionsRefetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => 
      gameService.getAllTransactions({ page: 1, limit: 10, sort: "date", order: SortOrder.asc })
    .then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (couponId: string) => DeleteCouponAction(couponId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ couponId, body }: { couponId: string; body: Coupon }) =>
      updateCouponAction(couponId, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const onEdit = useCallback(
    async (transaction: Transaction) => {
      // Implement edit logic here
      console.log("onEdit: ", transaction);
    },
    []
  );

  const onDelete = useCallback(
    async (couponId: string) => {
      deleteMutation.mutate(couponId, {
        onSuccess: () => {
          console.log("onDelete successfully");
          toast({
            variant: "destructive",
            description: "Coupon deleted successfully",
          });
        },
      });
    },
    [deleteMutation, toast]
  );

  const columns = useMemo(
    () => TransactionsColumns({ onEdit, onDelete, isMobile: !isDesktop }),
    [onDelete, onEdit, isDesktop]
  );
  
  const transactions = useMemo(() => {
    return transactionsData?.data?.items || [];
  }, [transactionsData]);


  if (transactionsLoading) {
    return <div>Loading...</div>;
  }

  if (transactionsError && Object.keys(transactionsError).length > 0) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <PageTitle>Játékosok fogadásai</PageTitle>

      {/* Search input */}
      <div className="mb-4">
        <Input
          placeholder="Keresés username, csapatnév, dátum vagy státusz alapján..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="py-5">
        <DataTable
          data={transactions as Transaction[]}
          columns={columns}
          onOpenDialog={onOpen}
        />
      </div>
    </>
  );
};

export default TransactionTable;
