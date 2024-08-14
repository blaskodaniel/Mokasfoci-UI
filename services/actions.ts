"use server";

import { revalidatePath } from "next/cache";
import ErrorHandler from "./error-handler";
import { teamService } from "./team-service";
import { Team } from "./types";
import { groupService } from "./group-service";

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
