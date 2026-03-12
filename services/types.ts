import {
  CouponStatus,
  CouponType,
  LogTypes,
  MatchOutcome,
  MatchStatus,
  MatchType,
  SortOrder,
  TransactionType,
} from "util/enums";

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
  search?: string;
  type?: string;
}

export type Group = {
  _id: string;
  name: string;
  groupWinnerId?: Team;
  isCalculated?: boolean;
};

export type Team = {
  _id: string;
  name: string;
  tla: string;
  groupid: Group;
  flag: string;
  win?: number;
  draw?: number;
  loss?: number;
  score?: number;
  getgoal?: number;
  kickgoal?: number;
  active?: boolean;
  isTournamentWinner?: boolean;
  position?: number;
  playedGames?: number;
  goalDifference?: number;
};

export type CreateTeamPostBody = {
  name: string;
  groupid: string;
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
  teamA?: Team;
  teamAPlaceholder?: string;
  teamB?: Team;
  teamBPlaceholder?: string;
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
  isCalculated?: boolean;
  additionalOdds?: {
    advancement?: {
      teamAOdds: number;
      teamBOdds: number;
    };
    scoreOdds?: {
      exactMatch: number;
      goalDifference: number;
      outcome: number;
    };
  };
  position?: number;
};

export type MatchInfoResponse = {
  success: boolean;
  data: MatchInfo;
};

export type MatchInfo = {
  totalPlayers: number;
  playersWhoBet: number;
  playersWhoDidNotBet: number;
  betPercentage: string;
  correctPredictions: number;
  incorrectPredictions: number;
  maxWinAmount: number;
  bestPlayerName: string;
  isCalculated: boolean;
};

export interface ITableActionsProps<T> {
  rowData: T;
  onEdit: (row: T) => void;
  onDelete?: (row: T) => void;
  onCalculation?: (row: T) => void;
  onValidation?: (row: T) => void;
  onRevertCalculation?: (row: T) => void;
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
  groupWinCount: number;
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

export interface Coupon {
  _id: string;
  userid: User;
  matchid: Match;
  amount: number;
  odds: number;
  totalWin: number;
  success: boolean;
  status: CouponStatus;
  outcome: MatchOutcome;
  date: string;
  type: CouponType;
  isFavoriteTeam?: boolean;
  scoreTeamA?: number;
  scoreTeamB?: number;
  teamId?: string;
}

export interface Transaction {
  _id: string;
  userid: User;
  amount: number;
  type: TransactionType;
  date: string;
  comment?: string;
  matchid?: Match;
  couponid?: Coupon;
}

export interface Log {
  _id: string;
  message: string;
  stack?: string;
  type: LogTypes;
  useragent?: string;
  ip?: string;
  datetime: string;
  identityEmail?: string;
  errorCode?: number;
}

export interface GetAllTransactionsResponse {
  success: boolean;
  data: PaginationResponse<Transaction>;
}

export interface GetAllCouponsResponse {
  success: boolean;
  data: PaginationResponse<Coupon>;
}

export interface GetAllMatchesResponse {
  success: boolean;
  data: PaginationResponse<Match>;
}

export interface CreateTransactionBody {
  userid: string;
  amount: number;
  type: string;
  comment?: string;
  matchid?: string;
  couponid?: string;
}

export interface ScheduleMatch {
  matchId: string;
  scheduledFor: Date;
  teamA: string;
  teamB: string;
}

export interface GetSchedulerStatusResponse {
  success: boolean;
  data: {
    isInitialized: boolean;
    scheduledCount: number;
    scheduledMatches: ScheduleMatch[];
  };
}

export interface DashboardStats {
  success: boolean;
  data: {
    totalPlayers: number;
    lastRegistrationDate: string;
    activeCoupons: number;
    errorLogsCount: number;
    lastErrorLogDate: string;
    totalSystemBalance: number;
    totalSystemProfit: number;
    recentTransactions: Transaction[];
    teamsCount: number;
    matchesCount: number;
  };
}

export interface UserScoresValidation {
  userId: string;
  username: string;
  email: string;
  transactionCount: number;
  currentScores: {
    availableScore: number;
    profitScore: number;
  };
  calculatedScores: {
    availableScore: number;
    profitScore: number;
  };
  differences: {
    availableScore: number;
    profitScore: number;
  };
  isCorrect: {
    availableScore: boolean;
    profitScore: boolean;
    overall: boolean;
  };
}

export interface UserScoresValidationResponse {
  success: boolean;
  data: UserScoresValidation;
}

export interface GetLogsResponse {
  success: boolean;
  data: {
    items: Log[];
    total: number;
    page: number;
    limit: number;
  };
}
