"use server";

import { revalidatePath } from "next/cache";
import ErrorHandler from "./error-handler";
import { teamService } from "./team-service";
import { Team } from "./types";
import { groupService } from "./services";
import { AxiosResponse } from "axios";
import { removeUserTokenFromCookie } from "util/commons";
import { redirect } from "next/navigation";

export async function GetGroupsAction() {
  try {
    const data = await groupService.getGroups();
    return data.data;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function DeleteGroupAction(groupId: string, refreshPath?: string) {
  try {
    await groupService.deleteGroup(groupId);

    refreshPath && revalidatePath(refreshPath);
    return true;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function DeleteAction(
  id: string,
  deleteRequest: (id: string) => Promise<AxiosResponse<boolean>>,
  refreshPath?: string
) {
  try {
    await deleteRequest(id);
    refreshPath && revalidatePath(refreshPath);
    return true;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function GetTeamsAction() {
  try {
    const data = await teamService.getTeams();
    return data.data;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function CreateTeamsAction(team: Team) {
  try {
    const data = await teamService.createTeam(team);
    return data.data;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export const onSubmitCreateTeam = async (formdata: FormData) => {
  "use server";
  const name = formdata.get("name");
  const flag = formdata.get("flag");
  if (name && flag) {
    await teamService.createTeam({
      name: name as string,
      flag: flag as string,
    });
    revalidatePath("/dashboard/teams");
  }
};

export const createGroupAction = async (predata: any, formdata: FormData) => {
  const groupname = formdata.get("groupname");
  if (groupname) {
    await groupService.createGroups(groupname as string);
    revalidatePath("/dashboard/groups");
  }
};

export const logOut = async () => {
  removeUserTokenFromCookie();
  redirect("/login");
};
