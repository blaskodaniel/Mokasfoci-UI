"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { revalidatePath } from "next/cache";
import { CreateTeamsAction, GetTeamsAction } from "services/actions";
import { teamService } from "services/team-service";
import { Team } from "services/types";

const TeamsTable = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });

  const addTeam = useMutation({
    mutationFn: (team: Team) => CreateTeamsAction(team),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
};

export default TeamsTable;
