import { AxiosResponse } from "axios";
import { axios } from "../util/axios";
import { Group, Team } from "./types";

export const teamService = {
  getTeams: async (): Promise<AxiosResponse<Team[]>> =>
    await axios.get("/team/all"),
  createTeam: async (team: Team): Promise<AxiosResponse<boolean>> =>
    await axios.post("/admin/team", team),
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
};
