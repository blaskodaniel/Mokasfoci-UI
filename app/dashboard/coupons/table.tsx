"use client";

import { useCallback, useMemo } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Coupon, Group, Team } from "services/types";
import { useDialog } from "store/useDialog";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import { CouponColumns } from "./columns";
import { DeleteCouponAction, updateCouponAction } from "services/actions";
import { gameService } from "services/services";

const CouponTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames: string[];
}) => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: couponsData,
    error: couponsError,
    isLoading: couponsLoading,
    refetch: couponsRefetch,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => gameService.getAllCoupons().then((res) => res.data),
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

  if (couponsLoading) {
    return <div>Loading...</div>;
  }

  if (couponsError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  // A gameService már a megfelelő formátumban adja vissza az adatokat
  const coupons = couponsData?.data || [];

  return (
    <>
      <PageTitle>Játékosok fogadásai</PageTitle>

      <div className="py-5">
        <DataTable
          data={coupons as Coupon[]}
          columns={columns}
          filteredColumnNames={filteredColumnNames}
        />
      </div>
    </>
  );
};

export default CouponTable;
