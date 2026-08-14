"use server";

import ErrorHandler from "./error-handler";
import {
  Coupon,
  CreateMatchPostBody,
  CreateTeamPostBody,
  Group,
  Match,
  Team,
  UpdateMatchBody,
  User,
  UserCreateBody,
} from "./types";
import { configService, gameService, groupService, matchService, teamService, userService } from "./services";
import { AxiosResponse } from "axios";
import { removeUserTokenFromCookie } from "util/commons";
import { redirect } from "next/navigation";
import { SortOrder } from "util/enums";

export async function DeleteGroupAction(groupId: string) {
  try {
    await groupService.deleteGroup(groupId);

    return true;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function DeleteTeamAction(id: string) {
  try {
    await teamService.deleteTeam(id);

    return true;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function DeleteUserAction(id: string) {
  try {
    await userService.deleteUser(id);

    return true;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function DeleteMatchAction(id: string) {
  try {
    await matchService.deleteMatch(id);

    return true;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function createGroupAction(groupname: string) {
  await groupService.createGroup(groupname as string);
}

export async function createMatchAction(body: CreateMatchPostBody) {
  await matchService.createMatch(body);
}

export async function createUserAction(body: UserCreateBody) {
  await userService.createUser(body);
}

export async function updateMatchAction(match: Match) {
  await matchService.updateMatch(match, match._id);
}

export async function createTeamAction(body: CreateTeamPostBody) {
  await teamService.createTeam(body);
}

export async function updateGroupAction(id: string, body: Omit<Group, "_id">) {
  console.log("updateGroupAction: ", id, body);
  await groupService.updateGroup(id, body);
}

export async function updateTeamAction(id: string, body: Omit<Team, "_id">) {
  console.log("updateTeamAction: ", id, body);
  await teamService.updateTeam(id, body);
}

export async function updateUserAction(id: string, body: User) {
  console.log("updateUserAction: ", id, body);
  await userService.updateUser(body, id);
}

export async function updateSettingsAction(configName: string, value: string) {
  console.log("updateSettingsAction: ", configName, value);
  await configService.updateConfig(configName, value);
}

export async function DeleteAction(id: string, deleteRequest: (id: string) => Promise<AxiosResponse<boolean>>) {
  try {
    await deleteRequest(id);
    return true;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function GetMatchAction() {
  try {
    const data = await matchService.getMatches({
      page: 0,
      limit: 10,
      sort: "createdAt",
      order: SortOrder.desc,
    });
    return data.data;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function GetUsersAction() {
  try {
    const data = await userService.getUsers();
    return data.data;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export async function GetSettingsAction() {
  try {
    const { data } = await configService.getConfigs();
    return data;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}

export const logOut = async () => {
  removeUserTokenFromCookie();
  redirect("/login");
};

export async function updateCouponAction(couponId: string, body: Partial<Coupon>) {
  await gameService.updateCoupon(couponId, body);
}

export async function DeleteCouponAction(couponId: string) {
  try {
    await gameService.deleteCoupon(couponId);
    return true;
  } catch (error: unknown) {
    ErrorHandler(error);
    throw error;
  }
}
