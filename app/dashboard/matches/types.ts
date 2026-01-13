import {  Match, ScheduleMatch } from "services/types";

export interface MatchTableItem extends Match {
  schedulerStatus?: ScheduleMatch
}