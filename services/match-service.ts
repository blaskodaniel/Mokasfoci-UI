import { axios } from "util/axios";
import { Match } from "./types";
import ErrorHandler from "./error-handler";

export const matchService = {
  getMatches: async (): Promise<Match[]> => {
    try {
      const response = await axios.get("/match/all");
      return response.data;
    } catch (error: unknown) {
      ErrorHandler(error);
      return [];
    }
  },
};
