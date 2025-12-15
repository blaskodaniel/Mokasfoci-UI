"use client";

import DataTable from "@ui/dashboard/table/data-table";
import { PageTitle } from "@ui/global/CommonStyles";
import CreateMatchDialog from "./createDialog";
import { useDialog } from "store/useDialog";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breakpoints } from "util/responsive";
import {
  DeleteMatchAction,
  GetMatchAction,
  GetTeamsAction,
  updateMatchAction,
} from "services/actions";
import { Match, Team } from "services/types";
import { useCallback, useMemo } from "react";
import { MatchColumns } from "./columns";
import { useMediaQuery } from "hooks/useMediaQuery";
import { gameService } from "services/services";

const MatchTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames: string[];
}) => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { onOpen } = useDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: GetMatchAction,
  });

  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
    refetch: teamsRefetch,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });

  const calculateScoreByMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      // Call the game service to calculate score by match
      gameService.calculateScoreByMatch(matchId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ body }: { body: Match }) => updateMatchAction(body),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DeleteMatchAction(id, "/dashboard/matches"),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const onEdit = useCallback(
    async (match: Match) => {
      updateMutation.mutate(
        {
          body: match,
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
      console.log("Delete match: ", id);
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            description: "The match is deleted",
          });
        },
      });
    },
    [deleteMutation, toast]
  );

  const onCalculation = useCallback(
    async (match: Match) => {
      console.log("Calculate match: ", match);
      calculateScoreByMatchMutation.mutate(match._id, {
        onSuccess: () => {
          toast({
            description: "The match is calculated",
          });
        },
        onError: (error) => {
          toast({
            description: `Error calculating the match", ${error}`,
          });
        },
      });
    },
    [calculateScoreByMatchMutation, toast]
  );

  const columns = useMemo(
    () =>
      MatchColumns({ onEdit, onDelete, onCalculation, isMobile: !isDesktop }),
    [onDelete, onEdit, onCalculation, isDesktop]
  );

  const teams = teamsData as Team[];
  const matches = matchesData as Match[];

  return (
    <>
      <PageTitle>Matches</PageTitle>
      <div className="py-5">
        <DataTable
          data={matches}
          columns={columns}
          teams={teams}
          filteredColumnNames={filteredColumnNames}
          onOpenDialog={onOpen}
        />
        <CreateMatchDialog teams={teams} />
      </div>
    </>
  );
};

export default MatchTable;
