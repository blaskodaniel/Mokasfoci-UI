export enum MatchType {
  Final = "Final",
  Semifinal = "Semifinal",
  ThirdPlacePlayoff = "ThirdPlacePlayoff",
  Quarterfinal = "Quarterfinal",
  RoundOf16 = "RoundOf16",
  RoundOf32 = "RoundOf32",
  GroupStageRound1 = "GroupStageRound1",
  GroupStageRound2 = "GroupStageRound2",
  GroupStageRound3 = "GroupStageRound3",
}

export enum MatchStatus {
  disabled = "disabled",
  enabled = "enabled",
  playing = "playing",
  finished = "finished",
  posponted = "postponted",
}

export enum MatchOutcome {
  home = "1",
  draw = "x",
  away = "2",
}

export enum Roles {
  player = "player",
  admin = "admin",
}

export enum CouponStatus {
  inactive = "inactive",
  active = "active",
  closed = "closed",
  inprogress = "inprogress",
  processed = "processed",
}

export enum CouponType {
  outcomeBet = "outcomeBet",
  scoreBet = "scoreBet",
}

export enum TransactionType {
  bet = "bet",
  win = "win",
  penalty = "penalty",
  refund = "refund",
  initial = "initial",
  correction = "correction",
  betModification = "betModification",
  reward = "reward",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export enum LogTypes {
  error = "error",
  info = "info",
  warning = "warning",
}
