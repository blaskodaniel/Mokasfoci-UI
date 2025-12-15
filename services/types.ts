import { MatchOutcome, MatchStatus, MatchType } from "util/enums";

export type Group = {
  _id: string;
  name: string;
  winteamid?: Team;
};

export type Team = {
  _id: string;
  name: string;
  groupId: string;
  flag: string;
  win?: number;
  draw?: number;
  loss?: number;
  score?: number;
  getgoal?: number;
  kickgoal?: number;
  active?: boolean;
};

export type CreateTeamPostBody = {
  name: string;
  groupId: string;
  flag: string;
  active: boolean;
};

export type CreateMatchPostBody = {
  teamA?: string;
  teamB?: string;
  date?: Date;
};

export type UpdateMatchBody = Omit<Match, "_id | externalID | timer">;

export type LoginType = {
  data: { token: string };
};

export type Match = {
  _id: string;
  teamA?: string;
  teamB?: string;
  goalA?: number;
  goalB?: number;
  oddsAwin?: number;
  oddsDraw?: number;
  oddsBwin?: number;
  date?: Date;
  type: MatchType;
  timer?: boolean;
  location?: string;
  status: MatchStatus;
  comment?: string | null;
  outcome?: MatchOutcome;
  externalID?: string;
};

export interface ITableActionsProps<T> {
  rowData: T;
  onEdit: (row: T) => void;
  onDelete?: (row: T) => void;
  onCalculation?: (row: T) => void;
}

type UserData = {
  teamid: Team;
  winteamid: Team;
  A: Team;
  B: Team;
  C: Team;
  D: Team;
  E: Team;
  F: Team;
  G: Team;
  H: Team;
  profitScore: number;
  availableScore: number;
  notbetcount: number;
  winteamcount: number;
  couponwin: number;
  couponlost: number;
  coupons: number;
};

type UserSettings = {
  oddssuggest: boolean;
};

export enum Roles {
  player = "player",
  admin = "admin",
}

export type User = {
  _id: string;
  publicId: string;
  createdAt: string;
  username: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  avatar: string;
  active: boolean;
  data: UserData;
  settings: UserSettings;
  role: Roles;
  setPassword(password: string): Promise<void>;
};

export type UserCreateBody = {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type Config = Record<string, any>;
