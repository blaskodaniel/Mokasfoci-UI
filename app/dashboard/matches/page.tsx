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
import { MatchType, SortOrder } from "util/enums";
import { Breakpoints } from "util/responsive";
import { MatchTableItem } from "./types";
import MatchList from "./matchList";
import { Button } from "@/components/ui/button";
import CreateMatchDialog from "./createDialog";
import EditMatchDialog from "./editDialog";
import { GoPlus } from "react-icons/go";
import Pagination from "./Pagination";
import Legend from "./legend";
import MatchInfoDialog from "./infoDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const MatchesList = () => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { onOpen } = useDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(15);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: schedulerStatusData, error: schedulerStatusError, isLoading: schedulerStatusLoading } = useGetStatus();

  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage + 1,
      limit: size,
      sort: "date",
      order: SortOrder.desc,
    };

    if (typeFilter !== "all") {
      params.type = typeFilter;
    }
    if (appliedSearchTerm) {
      params.search = appliedSearchTerm;
      params.page = 1;
    }

    return params;
  }, [currentPage, size, typeFilter, appliedSearchTerm]);

  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useQuery({
    queryKey: ["matches", queryParams],
    queryFn: () => matchService.getMatches(queryParams).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
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
    return matchesData?.data || { limit: 15, page: 1, total: 0 };
  }, [matchesData]);

  const totalPages = Math.ceil(total / limit);

  const reversCalculateMatchMutation = useRevertMatchCalculation();

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [infoMatch, setInfoMatch] = useState<Match | null>(null);

  const calculateScoreByMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      // Call the game service to calculate score by match
      gameService.calculateScoreByMatch(matchId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DeleteMatchAction(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  const onEdit = useCallback((match: Match) => {
    setEditingMatch(match);
  }, []);

  const onShowInfo = useCallback((match: Match) => {
    setInfoMatch(match);
  }, []);

  const onDelete = useCallback(
    async (id: string) => {
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
      calculateScoreByMatchMutation.mutate(match._id, {
        onSuccess: (data) => {
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

  const teams = teamsData ?? [];

  if (matchesLoading || teamsLoading || schedulerStatusLoading) {
    return <div>Loading...</div>;
  }

  if (matchesError || teamsError || schedulerStatusError) {
    return <div>Hiba történt az adatok betöltése közben.</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2 py-2 rounded-md ">
        <h2 className="font-semibold text-lg mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 w-[300px]">
            <label className="text-sm text-gray-600">Keresés</label>
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Csapatnév..."
                className="h-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAppliedSearchTerm(searchTerm);
                  }
                }}
              />
              <Button variant="outline" size="sm" className="h-9" onClick={() => setAppliedSearchTerm(searchTerm)}>
                Keresés
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1 w-[200px]">
            <label className="text-sm text-gray-600">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.values(MatchType).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTypeFilter("all");
              setSearchTerm("");
              setAppliedSearchTerm("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5 mb-3">
        <div>Mérkőzések száma: {matchesData?.data.total}</div>
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
        onShowInfo={onShowInfo}
        isMobile={!isDesktop}
      />
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={size}
        onPageSizeChange={(newSize) => {
          setSize(newSize);
          setCurrentPage(0);
        }}
        total={total}
        showPageSize={true}
      />
      <Legend />
      <CreateMatchDialog teams={teams} />
      <EditMatchDialog
        isOpen={!!editingMatch}
        onClose={() => setEditingMatch(null)}
        match={editingMatch || undefined}
        teams={teams}
      />
      <MatchInfoDialog isOpen={!!infoMatch} onClose={() => setInfoMatch(null)} match={infoMatch} />
    </div>
  );
};

export default MatchesList;
