"use client";

import { useCallback, useMemo } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  DeleteTeamAction,
  GetTeamsAction,
  updateTeamAction,
} from "services/actions";
import { Team } from "services/types";
import { TeamColumns } from "./columns";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import CreateTeamDialog from "./createDialog";
import { useDialog } from "store/useDialog";

const TeamsTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames?: string[];
}) => {
  const { onOpen } = useDialog();
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
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
    mutationFn: (id: string) => DeleteTeamAction(id, "/dashboard/teams"),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Team }) =>
      updateTeamAction(id, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const onEdit = useCallback(
    async (team: Team) => {
      updateMutation.mutate(
        {
          id: team._id,
          body: team,
        },
        {
          onSuccess: () => {
            console.log("Update successfully");
            toast({
              description: "Update successfully",
            });
          },
        }
      );
    },
    [toast, updateMutation]
  );

  const onDelete = useCallback(
    async (id: string) => {
      console.log("Delete team: ", id);
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            description: "The team is deleted",
          });
        },
      });
    },
    [deleteMutation, toast]
  );

  const columns = useMemo(
    () => TeamColumns({ onEdit, onDelete, isMobile: !isDesktop }),
    [onDelete, onEdit, isDesktop]
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
          hideColumns={{
            win: false,
            draw: false,
            loss: false,
          }}
          onOpenDialog={onOpen}
        />
        <CreateTeamDialog />
      </div>
    </>
  );
};

export default TeamsTable;
