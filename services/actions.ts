"use server";

import { revalidatePath } from "next/cache";
import ErrorHandler from "./error-handler";
import {
  CreateMatchPostBody,
  CreateTeamPostBody,
  Group,
  Match,
  Team,
  UpdateMatchBody,
  User,
  UserCreateBody,
} from "./types";
import {
  configService,
  groupService,
  matchService,
  teamService,
  userService,
} from "./services";
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

export async function DeleteTeamAction(id: string, refreshPath?: string) {
  try {
    await teamService.deleteTeam(id);

    refreshPath && revalidatePath(refreshPath);
    return true;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function DeleteUserAction(id: string, refreshPath?: string) {
  try {
    await userService.deleteUser(id);

    refreshPath && revalidatePath(refreshPath);
    return true;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function DeleteMatchAction(id: string, refreshPath?: string) {
  try {
    await matchService.deleteMatch(id);

    refreshPath && revalidatePath(refreshPath);
    return true;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function createGroupAction(groupname: string) {
  await groupService.createGroup(groupname as string);
  revalidatePath("/dashboard/groups");
}

export async function createMatchAction(body: CreateMatchPostBody) {
  await matchService.createMatch(body);
  revalidatePath("/dashboard/matches");
}

export async function createUserAction(body: UserCreateBody) {
  await userService.createUser(body);
  revalidatePath("/dashboard/users");
}

export async function updateMatchAction(match: Match) {
  await matchService.updateMatch(match, match._id);
  revalidatePath("/dashboard/matches");
}

export async function createTeamAction(body: CreateTeamPostBody) {
  await teamService.createTeam(body);
  revalidatePath("/dashboard/teams");
}

export async function updateGroupAction(id: string, body: Omit<Group, "_id">) {
  console.log("updateGroupAction: ", id, body);
  await groupService.updateGroup(id, body);
  revalidatePath("/dashboard/groups");
}

export async function updateTeamAction(id: string, body: Omit<Team, "_id">) {
  console.log("updateTeamAction: ", id, body);
  await teamService.updateTeam(id, body);
  revalidatePath("/dashboard/groups");
}

export async function updateUserAction(id: string, body: User) {
  console.log("updateUserAction: ", id, body);
  await userService.updateUser(body, id);
  revalidatePath("/dashboard/groups");
}

export async function updateSettingsAction(configName: string, value: string) {
  console.log("updateSettingsAction: ", configName, value);
  await configService.updateConfig(configName, value);
  revalidatePath("/dashboard/settings");
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

export async function GetMatchAction() {
  try {
    const data = await matchService.getMatches();
    return data.data;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function GetUsersAction() {
  try {
    const data = await userService.getUsers();
    return data.data;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export async function GetSettingsAction() {
  try {
    const { data } = await configService.getConfigs();
    return data;
  } catch (error: unknown) {
    const errorMsg = ErrorHandler(error);
    return { error: errorMsg };
  }
}

export const logOut = async () => {
  removeUserTokenFromCookie();
  redirect("/login");
};
