"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { gameService } from "services/services";
import { CouponStatus, CouponType, MatchStatus, SortOrder } from "util/enums";
import { Coupon } from "services/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSearchOutline } from "react-icons/io5";
import CouponListItem from "./components/CouponListItem";

const CouponList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(15);

  // Filters
  const [usernameFilter, setUsernameFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState("");
  const [successFilter, setSuccessFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage + 1,
      limit: size,
      sort: "date",
      order: SortOrder.desc,
    };

    if (usernameFilter) params.username = usernameFilter;
    if (matchFilter) params.match = matchFilter;
    if (successFilter !== "all") params.success = successFilter === "true";
    if (statusFilter !== "all") params.status = statusFilter;
    if (typeFilter !== "all") params.type = typeFilter;

    return params;
  }, [currentPage, size, usernameFilter, matchFilter, successFilter, statusFilter, typeFilter]);

  const {
    data: couponsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["coupons", queryParams],
    queryFn: () => gameService.getAllCoupons(queryParams).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const coupons = useMemo(() => {
    return couponsData?.data?.items || [];
  }, [couponsData]);

  const { total } = useMemo(() => {
    return couponsData?.data || { limit: 15, page: 1, total: 0 };
  }, [couponsData]);

  const totalPages = Math.ceil(total / size);
  const totalCount = couponsData?.data?.total || 0;

  const handleFilterChange = () => {
    setCurrentPage(0);
    refetch(); // mostly handled by queryKey change, but just in case
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 p-4 rounded-md ">
        <h2 className="font-semibold text-lg mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 w-[200px]">
            <label className="text-sm text-gray-600">Username</label>
            <Input
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
              placeholder="Filter by username"
              className="h-9"
            />
          </div>

          <div className="flex flex-col gap-1 w-[200px]">
            <label className="text-sm text-gray-600">Match</label>
            <Input
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              placeholder="Team name..."
              className="h-9"
            />
          </div>

          <div className="flex flex-col gap-1 w-[150px]">
            <label className="text-sm text-gray-600">Success</label>
            <Select value={successFilter} onValueChange={setSuccessFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 w-[150px]">
            <label className="text-sm text-gray-600">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.values(CouponStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 w-[150px]">
            <label className="text-sm text-gray-600">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.values(CouponType).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setUsernameFilter("");
              setMatchFilter("");
              setSuccessFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="flex gap-1 flex-col">
        {isLoading && <div className="p-4 text-center text-gray-500">Loading coupons...</div>}

        {!isLoading && coupons.length === 0 && <div className="p-4 text-center text-gray-500">No coupons found.</div>}

        {coupons.map((coupon: Coupon) => (
          <CouponListItem key={coupon._id} coupon={coupon} />
        ))}
      </div>

      {/* Simple Pagination */}
      <div className="flex justify-between items-center mt-2 p-2">
        <div className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages} (total: {totalCount})
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CouponList;
