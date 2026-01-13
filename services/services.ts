import { AxiosResponse } from "axios";
import { axios } from "../util/axios";
import {
  Config,
  Coupon,
  CreateMatchPostBody,
  CreateTeamPostBody,
  CreateTransactionBody,
  GetAllTransactionsResponse,
  GetSchedulerStatusResponse,
  Group,
  Match,
  PaginationParams,
  Team,
  UpdateMatchBody,
  User,
  UserCreateBody,
} from "./types";

export const teamService = {
  getTeams: async (): Promise<AxiosResponse<Team[]>> =>
    await axios.get("/team/all"),
  createTeam: async (
    body: CreateTeamPostBody
  ): Promise<AxiosResponse<boolean>> => await axios.post("/team", body),
  deleteTeam: async (teamId: string): Promise<AxiosResponse<boolean>> =>
    await axios.delete(`/team/${teamId}`),
  updateTeam: async (teamId: string, teamBody: Omit<Team, "_id">) =>
    await axios.patch(`/team/${teamId}`, teamBody),
};

export const groupService = {
  getGroups: async (): Promise<AxiosResponse<Group[]>> =>
    await axios.get("/group/all"),
  deleteGroup: async (groupId: string): Promise<AxiosResponse<boolean>> =>
    await axios.delete(`/admin/group/${groupId}`),
  updateGroup: async (
    groupId: string,
    groupBody: Omit<Group, "_id">
  ): Promise<AxiosResponse<boolean>> =>
    await axios.patch(`/admin/group/${groupId}`, groupBody),
  createGroup: async (name: string): Promise<AxiosResponse<Group>> =>
    await axios.post("/admin/group", { name }),
};

export const matchService = {
  getMatches: async (): Promise<AxiosResponse<Match[]>> =>
    await axios.get("/match/admin/all"),
  createMatch: async (
    body: CreateMatchPostBody
  ): Promise<AxiosResponse<boolean>> => await axios.post("/match", body),
  updateMatch: async (body: Match, id: string) =>
    await axios.patch(`/match/${id}`, body),
  deleteMatch: async (matchId: string): Promise<AxiosResponse<boolean>> =>
    await axios.delete(`/match/${matchId}`),
};

export const userService = {
  getUsers: async (): Promise<AxiosResponse<User[]>> =>
    await axios.get("/user/admin/all"),
  updateUser: async (body: User, id: string) =>
    await axios.patch(`/user/admin/${id}`, body),
  deleteUser: async (userId: string): Promise<AxiosResponse<boolean>> =>
    await axios.delete(`/user/admin/${userId}`),
  createUser: async (body: UserCreateBody): Promise<AxiosResponse<boolean>> =>
    await axios.post("/user/admin/create", body),
};

export const configService = {
  getConfigs: async (): Promise<AxiosResponse<Config>> =>
    await axios.get("/config/all"),
  updateConfig: async (
    config: string,
    value: string
  ): Promise<AxiosResponse<Config>> =>
    await axios.patch(`/config/${config}`, { value }),
};

export const gameService = {
  calculateScoreByMatch: async (
    matchId: string
  ): Promise<
    AxiosResponse<{
      success: boolean;
      processedCoupons: number;
      penalizedUsers: number;
    }>
  > => await axios.get(`/admin/calculation/${matchId}`),
  getAllCoupons: async (): Promise<
    AxiosResponse<{ success: boolean; data: Coupon[] }>
  > => await axios.get("/admin/coupons"),
  updateCoupon: async (
    couponId: string,
    body: Partial<Coupon>
  ): Promise<AxiosResponse<boolean>> =>
    await axios.patch(`/admin/coupon/${couponId}`, body),
  deleteCoupon: async (couponId: string): Promise<AxiosResponse<boolean>> =>
    await axios.delete(`/admin/coupon/${couponId}`),
  resetGame: async (): Promise<AxiosResponse<boolean>> =>
    await axios.post("/admin/reset-game"),
  getAllTransactions: async (
    params: PaginationParams
  ): Promise<AxiosResponse<GetAllTransactionsResponse>> =>
    await axios.get("/admin/transactions", { params }),
  createTransaction: async (
    body: CreateTransactionBody
  ): Promise<AxiosResponse<boolean>> =>
    await axios.post("/admin/transaction", body),
  revertCalculation: async (
    matchId: string
  ): Promise<
    AxiosResponse<{
      success: boolean;
      message: string;
      affectedCoupons: number;
    }>
  > => await axios.post(`/admin/revert-calculation/${matchId}`),
};

export const MatchSchedulerService = {
  getStatus: async (): Promise<AxiosResponse<GetSchedulerStatusResponse>> =>
    await axios.get("/admin/scheduler-status"),
};
