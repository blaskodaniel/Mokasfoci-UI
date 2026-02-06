"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRevertMatchCalculation } from "hooks/useMatches";
import { useGetStatus } from "hooks/useMatchScheduler";
import { useMediaQuery } from "hooks/useMediaQuery";
import { useCallback, useMemo, useState } from "react";
import { DeleteMatchAction, updateMatchAction } from "services/actions";
import { gameService, matchService, teamService } from "services/services";
import { Match, Team } from "services/types";
import { useDialog } from "store/useDialog";
import { SortOrder } from "util/enums";
import { Breakpoints } from "util/responsive";
import { MatchTableItem } from "../matches/types";
import MatchList from "./matchList";
import { Button } from "@/components/ui/button";
import CreateMatchDialog from "./createDialog";
import EditMatchDialog from "./editDialog";
import { GoPlus } from "react-icons/go";

const MatchesList = () => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { onOpen } = useDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data: schedulerStatusData, error: schedulerStatusError, isLoading: schedulerStatusLoading } = useGetStatus();

  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useQuery({
    queryKey: ["matches", currentPage, size, searchTerm],
    queryFn: () =>
      matchService
        .getMatches({
          page: currentPage + 1,
          limit: size,
          sort: "date",
          order: SortOrder.desc,
          search: searchTerm,
        })
        .then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
    refetch: teamsRefetch,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams().then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const matchTableData: MatchTableItem[] = useMemo(() => {
    const matches = matchesData?.data.items as Match[];
    if (!matches || !Array.isArray(matches)) return [];

    return matches.map((match: Match) => {
      const scheduledMatch = schedulerStatusData?.data.scheduledMatches?.find((sm) => sm.matchId === match._id);
      return {
        ...match,
        schedulerStatus: scheduledMatch,
      };
    });
  }, [matchesData, schedulerStatusData]);

  const { limit, page, total } = useMemo(() => {
    return matchesData?.data || { limit: 10, page: 1, total: 0 };
  }, [matchesData]);

  const totalPages = Math.ceil(total / limit);

  const reversCalculateMatchMutation = useRevertMatchCalculation();

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const calculateScoreByMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      // Call the game service to calculate score by match
      gameService.calculateScoreByMatch(matchId),
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

  const onEdit = useCallback((match: Match) => {
    setEditingMatch(match);
  }, []);

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
    [deleteMutation, toast],
  );

  const onCalculation = useCallback(
    async (match: Match) => {
      console.log("Calculate match: ", match);
      calculateScoreByMatchMutation.mutate(match._id, {
        onSuccess: (data) => {
          console.log("Match calculated: ", data);
          toast({
            description: `${data.data.processedCoupons} coupons calculated successfully 
            and ${data.data.penalizedUsers} users penalized.`,
          });
        },
        onError: (error) => {
          toast({
            description: `Error calculating the match", ${error}`,
          });
        },
      });
    },
    [calculateScoreByMatchMutation, toast],
  );

  const onRevertCalculation = useCallback(
    async (match: Match) => {
      reversCalculateMatchMutation.mutate(match._id, {
        onSuccess: (data) => {
          toast({
            description: `${data.data.affectedCoupons} coupons reverted successfully 
            and penalties reverted.`,
          });
        },
        onError: (error) => {
          toast({
            description: `Error reverting the match", ${error}`,
          });
        },
      });
    },
    [reversCalculateMatchMutation, toast],
  );

  const teams = teamsData as Team[];

  return (
    <div>
      <div className="flex justify-end mt-5 mb-3">
        <Button className="bg-emerald-700 hover:bg-emerald-600 h-8" variant="outline" onClick={onOpen} type="button">
          <GoPlus className="mr-2 h-4 w-4" />
          Új mérkőzés
        </Button>
      </div>
      <MatchList
        matches={matchTableData}
        teams={teams}
        onEdit={onEdit}
        onDelete={onDelete}
        onCalculation={onCalculation}
        onRevertCalculation={onRevertCalculation}
        isMobile={!isDesktop}
      />

      <CreateMatchDialog teams={teams} />
      <EditMatchDialog
        isOpen={!!editingMatch}
        onClose={() => setEditingMatch(null)}
        match={editingMatch || undefined}
        teams={teams}
      />
    </div>
  );
};

export default MatchesList;
