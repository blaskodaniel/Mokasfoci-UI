import { axios } from "../util/axios";
import { LoginType } from "./types";

export const authService = {
  login: async (username: string, password: string): Promise<LoginType> =>
    await axios.post("/auth/login", { username, password }),
};
