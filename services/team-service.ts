import { AxiosResponse } from "axios";
import { axios } from "../util/axios";
import { Team } from "./types";

export const teamService = {
  getTeams: async (): Promise<AxiosResponse<Team[]>> =>
    await axios.get("/team/all"),
  createTeam: async (team: Team): Promise<AxiosResponse<boolean>> =>
    await axios.post("/admin/team", team),
};
