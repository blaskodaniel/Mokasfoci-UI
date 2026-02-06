import { FaEye, FaEyeSlash, FaRegCheckCircle } from "react-icons/fa";
import { MatchStatus } from "util/enums";
import { getMatchStatusInfo } from "util/commons";
import { ScheduleMatch } from "services/types";
import { MdOutlineTimer } from "react-icons/md";

export const MatchStatusBadge = ({ status }: { status: MatchStatus }) => {
  if (status === MatchStatus.finished) {
    return <FaRegCheckCircle className="text-green-500" size={19} />;
  }
  if (status === MatchStatus.playing) {
    return <span className="w-4 h-4 inline-block rounded-full bg-red-500 animate-pulse" />;
  }
  if (status === MatchStatus.enabled) {
    return <FaEye />;
  }
  if (status === MatchStatus.disabled) {
    return <FaEyeSlash />;
  }
  return null;
};

export const SchedulerStatusBadge = ({ status }: { status?: ScheduleMatch }) => {
  if (status) {
    return <MdOutlineTimer className="text-orange-400" />;
  }
  return null;
};
