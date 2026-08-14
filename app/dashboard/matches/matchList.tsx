import { Team } from "services/types";
import { MatchTableItem } from "./types";
import { MatchStatusBadge, SchedulerStatusBadge } from "./status-badges";
import { format } from "date-fns";
import { getMatchTypeText } from "util/commons";
import { MatchStatus } from "util/enums";
import { MdPriceCheck } from "react-icons/md";
import MatchActionMenu from "./MatchActionMenu";

interface MatchListProps {
  matches: MatchTableItem[];
  teams: Team[];
  onEdit: (match: MatchTableItem) => void;
  onDelete: (id: string) => void;
  onCalculation: (match: MatchTableItem) => void;
  onRevertCalculation: (match: MatchTableItem) => void;
  onShowInfo: (match: MatchTableItem) => void;
  isMobile: boolean;
}

const MatchList = ({
  matches,
  teams,
  onEdit,
  onDelete,
  onCalculation,
  onRevertCalculation,
  onShowInfo,
  isMobile,
}: MatchListProps) => {
  return (
    <div className="flex gap-1 flex-col">
      {matches.map((match) => (
        <div key={match._id} className="flex gap-3 items-center border-b last:border-0 border-gray-500/30 p-2">
          <div className="w-[60px] flex gap-2">
            <MatchStatusBadge status={match.status} />
            <SchedulerStatusBadge status={match.schedulerStatus} />
            {match.isCalculated && <MdPriceCheck className="text-green-500" size={21} />}
          </div>
          <div className="flex gap-5 text-sm flex-1">
            <span className="font-light">{match?.date && format(new Date(match.date), "dd MMM")}</span>
            <span>{match?.date && format(new Date(match.date), "HH:mm")}</span>
          </div>
          <div className="flex gap-2 flex-1">
            <div>{match?.goalA ?? ""}</div>
            <div>-</div>
            <div>{match?.goalB ?? ""}</div>
          </div>
          <div
            role="button"
            className={`font-bold flex-[2] transition-colors ${
              match.status !== MatchStatus.disabled ? "cursor-pointer hover:text-blue-500" : "cursor-default"
            }`}
            onClick={() => match.status !== MatchStatus.disabled && onShowInfo(match)}
          >
            {match.teamA?.name || match.teamAPlaceholder || "-"} - {match.teamB?.name || match.teamBPlaceholder || "-"}
          </div>
          <div className="flex-1 text-sm font-light">{getMatchTypeText(match.type)}</div>
          <div className="flex flex-1 gap-1">
            <span className="flex-1 font-medium rounded-sm bg-blue-500/50 text-sm text-center">
              {match?.oddsAwin ?? "-"}
            </span>
            <span className="flex-1 font-medium rounded-sm bg-blue-500/50 text-sm text-center">
              {match?.oddsDraw ?? "-"}
            </span>
            <span className="flex-1 font-medium rounded-sm bg-blue-500/50 text-sm text-center">
              {match?.oddsBwin ?? "-"}
            </span>
          </div>
          <div className="w-[50px] text-xs text-gray-300">{match.position || "-"}</div>
          <div className="flex-1 text-xs text-gray-300">{match.comment || "-"}</div>
          <div>
            <MatchActionMenu
              match={match}
              onRevert={onRevertCalculation}
              onEdit={onEdit}
              onCalculation={onCalculation}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
