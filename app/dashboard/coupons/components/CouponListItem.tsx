"use client";

import { Coupon } from "services/types";
import { CouponStatus, CouponType, MatchStatus } from "util/enums";
import { format } from "date-fns";
import { FaCheck } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { useState } from "react";
import { MdMoreVert } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationModal from "components/ConfirmationModal";
import { gameService } from "services/services";

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

interface CouponListItemProps {
  coupon: Coupon;
  onDelete?: () => void;
}

const CouponListItem = ({ coupon, onDelete }: CouponListItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"standard" | "correction" | null>(null);

  const handleDelete = async () => {
    if (!modalType || !coupon._id) return;
    
    try {
      const restorePoints = modalType === "correction";
      await gameService.deleteCoupon(coupon._id, restorePoints);
      if (onDelete) onDelete();
    } catch (e) {
      console.error(e);
    } finally {
      setIsModalOpen(false);
      setModalType(null);
    }
  };

  const openModal = (type: "standard" | "correction") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-3 items-center border-b last:border-0 border-gray-500/30 p-2">
      <div className="w-[80px] flex-shrink-0">
        <CouponStatusBadge status={coupon.status} />
      </div>

      <div className="flex flex-col w-[120px] text-sm">
        <div className="font-semibold text-white/80">{coupon.userid?.username || "Unknown"}</div>
        <div className="text-xs text-gray-500">{coupon.date && format(new Date(coupon.date), "yyyy-MM-dd HH:mm")}</div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="font-bold text-white/80">
          {coupon.matchid?.teamA?.name || coupon.matchid?.teamAPlaceholder || "?"} -{" "}
          {coupon.matchid?.teamB?.name || coupon.matchid?.teamBPlaceholder || "?"}
        </div>
        <div className="text-xs text-gray-500 flex gap-2">
          {coupon.matchid?.status === MatchStatus.finished && (
            <span>
              {coupon.type === CouponType.scoreBet
                ? `Result: ${coupon.matchid.goalA ?? "-"} - ${coupon.matchid.goalB ?? "-"}`
                : `Outcome: ${coupon.matchid?.outcome || "-"}`}
            </span>
          )}
          {coupon.type === CouponType.scoreBet ? (
            <span>
              Player Prediction:{" "}
              <span className="font-semibold text-blue-600">
                {coupon.scoreTeamA ?? "?"} - {coupon.scoreTeamB ?? "?"}
              </span>
            </span>
          ) : (
            <span>
              Player Bet: <span className="font-semibold text-blue-600">{coupon.outcome}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-[250px] items-center text-sm">
        <div className="flex flex-col items-end flex-1">
          <span className="text-xs text-gray-500">Odds</span>
          <span className="font-mono">{coupon.odds || "-"}</span>
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
        {coupon.status === CouponStatus.closed && coupon.success === true && <FaCheck className="text-green-500" />}
        {coupon.status === CouponStatus.closed && coupon.success === false && <VscError className="text-red-500" />}
      </div>

      {/* Context Menu */}
      <div className="w-[30px] flex justify-center">
        {coupon.status === CouponStatus.active && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-700/50 rounded-md transition-colors">
                <MdMoreVert className="text-gray-300" size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openModal("correction")}>
                Törlés korrekcióval
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("standard")} className="text-red-500 focus:text-red-400 focus:bg-red-500/10 hover:text-red-400 hover:bg-red-500/10">
                Törlés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>

    <ConfirmationModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setModalType(null);
      }}
      onConfirm={handleDelete}
      title="Biztosan törlöd a kupont?"
      description={
        modalType === "correction" 
          ? "A törlésnél a pontok is korrigálásra (visszavonásra) kerülnek. Biztosan folytatod?" 
          : "Véglegesen törlöd ezt a kupont anélkül, hogy a játékos pontjai módosulnának. Biztosan folytatod?"
      }
      confirmText="Törlés"
      variant="destructive"
    />
    </>
  );
};

export default CouponListItem;
