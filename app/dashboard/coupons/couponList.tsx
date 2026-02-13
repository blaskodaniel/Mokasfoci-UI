"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { gameService } from "services/services";
import { CouponStatus, SortOrder } from "util/enums";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coupon } from "services/types";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegCheckCircle, FaTimesCircle, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { VscError } from "react-icons/vsc";

const CouponStatusBadge = ({ status }: { status: CouponStatus }) => {
  switch (status) {
    case CouponStatus.active:
      return <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Active</span>;
    case CouponStatus.inactive:
      return <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">Inactive</span>;
    case CouponStatus.closed:
      return <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Closed</span>;
    case CouponStatus.inprogress:
      return <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">In Progress</span>;
    case CouponStatus.processed:
      return <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">Processed</span>;
    default:
      return <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">{status}</span>;
  }
};

const CouponList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(15);

  // Filters
  const [usernameFilter, setUsernameFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState("");
  const [successFilter, setSuccessFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

    return params;
  }, [currentPage, size, usernameFilter, matchFilter, successFilter, statusFilter]);

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
          <div key={coupon._id} className="flex gap-3 items-center border-b last:border-0 border-gray-500/30 p-2">
            <div className="w-[80px] flex-shrink-0">
              <CouponStatusBadge status={coupon.status} />
            </div>

            <div className="flex flex-col w-[120px] text-sm">
              <div className="font-semibold text-white/80">{coupon.userid?.username || "Unknown"}</div>
              <div className="text-xs text-gray-500">
                {coupon.date && format(new Date(coupon.date), "yyyy-MM-dd HH:mm")}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="font-bold text-white/80">
                {coupon.matchid?.teamA?.name || coupon.matchid?.teamAPlaceholder || "?"} -{" "}
                {coupon.matchid?.teamB?.name || coupon.matchid?.teamBPlaceholder || "?"}
              </div>
              <div className="text-xs text-gray-500 flex gap-2">
                <span>Outcome: {coupon.matchid?.outcome || "-"}</span>
                <span>
                  Your Bet: <span className="font-semibold text-blue-600">{coupon.outcome}</span>
                </span>
              </div>
            </div>

            <div className="flex gap-4 w-[250px] items-center text-sm">
              <div className="flex flex-col items-end flex-1">
                <span className="text-xs text-gray-500">Odds</span>
                <span className="font-mono">{coupon.odds}</span>
              </div>
              <div className="flex flex-col items-end flex-1">
                <span className="text-xs text-gray-500">Amount</span>
                <span className="font-mono">{coupon.amount}</span>
              </div>
              <div className="flex flex-col items-end flex-1 font-semibold text-green-700">
                <span className="text-xs text-gray-500">Win</span>
                <span className="font-mono flex items-center">{coupon.success ? coupon.totalWin : 0}</span>
              </div>
            </div>

            <div className="w-[40px] flex justify-center">
              {coupon.status === CouponStatus.closed && coupon.success === true && (
                <FaCheck className="text-green-500" />
              )}
              {coupon.status === CouponStatus.closed && coupon.success === false && (
                <VscError className="text-red-500" />
              )}
            </div>
          </div>
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
