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

  const coupons = useMemo(() => {
    return couponsData?.data || [];
  }, [couponsData]);

  // Filter coupons based on search term
  const filteredCoupons = useMemo(() => {
    if (!searchTerm) return coupons;

    return coupons.filter((coupon: Coupon) => {
      const searchLower = searchTerm.toLowerCase();

      // Search in username
      const username = coupon.userid?.username?.toLowerCase() || "";

      // Search in team names (both teamA and teamB)
      const teamAName = coupon.matchid?.teamA?.name?.toLowerCase() || "";
      const teamBName = coupon.matchid?.teamB?.name?.toLowerCase() || "";
      const matchString = `${teamAName} - ${teamBName}`;

      // Search in date
      const date = new Date(coupon.date).toLocaleDateString().toLowerCase();

      // Search in status
      const status = coupon.status?.toLowerCase() || "";

      return (
        username.includes(searchLower) ||
        matchString.includes(searchLower) ||
        date.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  }, [coupons, searchTerm]);

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
          data={filteredCoupons as Coupon[]}
          columns={columns}
          onOpenDialog={onOpen}
        />
      </div>
    </>
  );
};

export default CouponTable;
