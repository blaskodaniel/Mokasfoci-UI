import { AxiosResponse } from "axios";
import { axios } from "../util/axios";
import { CreateTeamPostBody, Group, Team } from "./types";

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
