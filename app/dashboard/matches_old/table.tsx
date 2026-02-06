"use client";

import DataTable from "@ui/dashboard/table/data-table";
import { PageTitle } from "@ui/global/CommonStyles";
import CreateMatchDialog from "./createDialog";
import { useDialog } from "store/useDialog";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breakpoints } from "util/responsive";
import { DeleteMatchAction, GetMatchAction, GetTeamsAction, updateMatchAction } from "services/actions";
import { Match, Team } from "services/types";
import { useCallback, useMemo, useState } from "react";
import { MatchColumns } from "./columns";
import { useMediaQuery } from "hooks/useMediaQuery";
import { gameService, matchService, teamService } from "services/services";
import { useRevertMatchCalculation } from "hooks/useMatches";
import { useGetStatus } from "hooks/useMatchScheduler";
import { MatchTableItem } from "./types";
import { SortOrder } from "util/enums";

const MatchTable = ({ filteredColumnNames }: { filteredColumnNames: string[] }) => {
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
      queryClient.invalidateQueries({ queryKey: ["match-scheduler-status"] });
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
        },
      );
    },
    [toast, updateMutation],
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

  const columns = useMemo(() => {
    return MatchColumns({ onEdit, onDelete, onCalculation, onRevertCalculation, isMobile: !isDesktop });
  }, [onDelete, onEdit, onCalculation, onRevertCalculation, isDesktop]);

  const teams = teamsData as Team[];

  return (
    <>
      <PageTitle>Matches</PageTitle>
      <div className="py-5">
        <DataTable
          data={matchTableData}
          columns={columns}
          teams={teams}
          filteredColumnNames={filteredColumnNames}
          hideColumns={{
            isCalculated: false,
            date: false,
            comment: false,
          }}
          onOpenDialog={onOpen}
          enablePagination={true}
          manualPagination={true}
          pageSize={size}
          totalCount={total}
          pageCount={totalPages}
          onPaginationChange={(pageIndex, pageSize) => {
            setCurrentPage(pageIndex);
            setSize(pageSize);
          }}
        />
        <CreateMatchDialog teams={teams} />
      </div>
    </>
  );
};

export default MatchTable;
