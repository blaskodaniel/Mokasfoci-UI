import { axios } from "../util/axios";
import { AxiosError, AxiosResponse } from "axios";
import { Group } from "./service-types";

export const groupService = {
  getGroups: async (): Promise<Group[]> => {
    try {
      const response = await axios.get("/group/all");
      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
      return [];
    }
  },
  createGroups: async (name: string): Promise<boolean> => {
    try {
      await axios.post("/admin/group", { name });
      return true;
    } catch (error: unknown) {
      errorHandler(error);
      return false;
    }
  },
};

const errorHandler = (error: unknown) => {
  const AxError = error as AxiosError;
  const errorMsg =
    `${AxError.message}, path: ${AxError.request?.path}` ||
    "Error fetching data";
  console.error(errorMsg);
};
