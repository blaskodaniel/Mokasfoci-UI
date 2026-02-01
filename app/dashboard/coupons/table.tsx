"use client";

import { useCallback, useMemo, useState } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Coupon, Group, Team } from "services/types";
import { useDialog } from "store/useDialog";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import { CouponColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { DeleteCouponAction, updateCouponAction } from "services/actions";
import { gameService } from "services/services";
import { SortOrder } from "util/enums";
import { Button } from "@/components/ui/button";
import { IoSearchOutline } from "react-icons/io5";

const CouponTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames: string[];
}) => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { onOpen } = useDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(20);

  const {
    data: couponsData,
    error: couponsError,
    isLoading: couponsLoading,
    refetch: couponsRefetch,
  } = useQuery({
    queryKey: ["coupons", currentPage, size],
    queryFn: () => gameService.getAllCoupons({ 
      page: currentPage + 1, 
      limit: size, 
      sort: "date", 
      order: SortOrder.desc,
      search: searchTerm
    }).then((res) => res.data),
    placeholderData: (previousData) => previousData,
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
    async (coupon: Coupon) => {
      updateMutation.mutate(
        {
          couponId: coupon._id,
          body: coupon,
        },
        {
          onSuccess: () => {
            console.log("Update successfully");
            toast({
              description: "Update successfully",
            });
          },
        }
      );
    },
    [toast, updateMutation]
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
    () => CouponColumns({ onEdit, onDelete, isMobile: !isDesktop }),
    [onDelete, onEdit, isDesktop]
  );

  const coupons = useMemo(() => {
    return couponsData?.data?.items || [];
  }, [couponsData]);

  const {limit, page, total} = useMemo(() => {
    return couponsData?.data || {limit: 10, page: 1, total: 0};
  }, [couponsData]);

  const totalPages = Math.ceil(total / limit);

  if (couponsLoading) {
    return <div>Loading...</div>;
  }

  if (couponsError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <PageTitle>Játékosok fogadásai</PageTitle>

      {/* Search input */}
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Keresés username, csapatnév, dátum vagy státusz alapján..."
          value={searchTerm ?? ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          className="bg-emerald-700 hover:bg-emerald-600"
          variant="outline"
          onClick={() => {
            setCurrentPage(0);
            couponsRefetch();
          }}
        > 
        <IoSearchOutline className="mr-2 h-4 w-4" /> Search
      </Button>
      </div>

      <div className="py-5">
        <DataTable
          data={coupons}
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
      </div>
    </>
  );
};

export default CouponTable;
