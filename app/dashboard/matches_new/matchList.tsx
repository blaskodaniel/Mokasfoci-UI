import { ScheduleMatch, Team } from "services/types";
import { MatchTableItem } from "../matches/types";
import { MatchStatusBadge, SchedulerStatusBadge } from "./status-badges";
import { format } from "date-fns";
import { getMatchTypeText } from "util/commons";
import { MatchOutcome } from "util/enums";
import { MdOutlineTimer, MdPriceCheck } from "react-icons/md";
import MatchActionMenu from "./MatchActionMenu";
import Legend from "./legend";

interface MatchListProps {
  matches: MatchTableItem[];
  teams: Team[];
  onEdit: (match: MatchTableItem) => void;
  onDelete: (id: string) => void;
  onCalculation: (match: MatchTableItem) => void;
  onRevertCalculation: (match: MatchTableItem) => void;
  isMobile: boolean;
}

const MatchList = ({
  matches,
  teams,
  onEdit,
  onDelete,
  onCalculation,
  onRevertCalculation,
  isMobile,
}: MatchListProps) => {
  console.log(matches);

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
            <div>{match?.goalA || ""}</div>
            <div>-</div>
            <div>{match?.goalB || ""}</div>
          </div>
          <div className="font-bold flex-[2]">
            {match.teamA?.name || match.teamAPlaceholder || "-"} - {match.teamB?.name || match.teamBPlaceholder || "-"}
          </div>
          <div className="flex-1 text-sm font-light">{getMatchTypeText(match.type)}</div>
          <div className="flex flex-1 gap-1">
            <span className="flex-1 font-medium">{match?.oddsAwin ?? "-"}</span>
            <span className="flex-1 font-medium">{match?.oddsDraw ?? "-"}</span>
            <span className="flex-1 font-medium">{match?.oddsBwin ?? "-"}</span>
          </div>
          <div className="flex-1">
            {match?.outcome
              ? match.outcome === MatchOutcome.home
                ? "Hazai"
                : match.outcome === MatchOutcome.away
                  ? "Idegen"
                  : "Döntetlen"
              : "-"}
          </div>
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

      <Legend />
    </div>
  );
};

export default MatchList;
