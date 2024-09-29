"use client";

import { useCallback, useMemo } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  DeleteAction,
  DeleteGroupAction,
  GetTeamsAction,
} from "services/actions";
import { Team } from "services/types";
import { TeamColumns } from "./columns";
import { teamService } from "services/services";

const TeamsTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames?: string[];
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
    refetch: teamsRefetch,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      DeleteAction(id, teamService.deleteTeam, "/dashboard/teams"),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const onEdit = useCallback(async (value: string) => {
    console.log("onEdit: ", value);
  }, []);

  const onDelete = useCallback(
    async (groupId: string) => {
      deleteMutation.mutate(groupId, {
        onSuccess: () => {
          toast({
            variant: "destructive",
            description: "The team is deleted",
          });
        },
      });
    },
    [deleteMutation, toast]
  );

  const columns = useMemo(
    () => TeamColumns({ onEdit, onDelete }),
    [onDelete, onEdit]
  );

  if (teamsLoading) {
    return <div>Loading...</div>;
  }

  if (teamsError && Object.keys(teamsError).length > 0) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <PageTitle>Teams</PageTitle>
      <div className="py-5">
        <DataTable
          data={teamsData as Team[]}
          columns={columns}
          filteredColumnNames={filteredColumnNames}
        />
      </div>
    </>
  );
};

export default TeamsTable;
