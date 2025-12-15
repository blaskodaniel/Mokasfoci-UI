import { AxiosResponse } from "axios";
import { axios } from "../util/axios";
import {
  Config,
  CreateMatchPostBody,
  CreateTeamPostBody,
  Group,
  Match,
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
    await axios.get("/user/all"),
  updateUser: async (body: User, id: string) =>
    await axios.patch(`/user/${id}`, body),
  deleteUser: async (userId: string): Promise<AxiosResponse<boolean>> =>
    await axios.delete(`/user/${userId}`),
  createUser: async (body: UserCreateBody): Promise<AxiosResponse<boolean>> =>
    await axios.post("/user/create", body),
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
  ): Promise<AxiosResponse<boolean>> =>
    await axios.get(`/admin/calculation/${matchId}`),
};
