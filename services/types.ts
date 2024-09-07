import { MatchOutcome, MatchStatus, MatchType } from "util/enums";

export type Group = {
  _id: string;
  name: string;
  winteamid?: Team;
};

export type Team = {
  _id: string;
  name: string;
  flag: string;
  win?: number;
  draw?: number;
  loss?: number;
  score?: number;
  getgoal?: number;
  kickgoal?: number;
  active?: boolean;
};

export type LoginType = {
  data: { token: string };
};

export type Match = {
  teamA?: string;
  teamB?: string;
  goalA?: number;
  goalB?: number;
  oddsAwin?: number;
  oddsDraw?: number;
  oddsBwin?: number;
  date?: string;
  type: MatchType;
  timer?: boolean;
  location?: string;
  status: MatchStatus;
  comment?: string | null;
  outcome?: MatchOutcome;
  externalID?: string;
};
