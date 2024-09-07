import { axios } from "../util/axios";
import { Group } from "./types";
import ErrorHandler from "./error-handler";

export const groupService = {
  getGroups: async (): Promise<Group[]> => {
    try {
      const response = await axios.get("/group/all");
      return response.data;
    } catch (error: unknown) {
      ErrorHandler(error);
      return [];
    }
  },
  createGroups: async (name: string): Promise<boolean> => {
    try {
      await axios.post("/admin/group", { name });
      return true;
    } catch (error: unknown) {
      ErrorHandler(error);
      return false;
    }
  },
};
