import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gameService, matchService, userService } from "services/services";
import { Match } from "services/types";

export const useGetAllMatches = (enabled: boolean = true) => {
    return useQuery<Match[]>({
        queryKey: ["matches"],
        queryFn: async () => {
            const response = await matchService.getMatches();
            return response.data;
        },
        staleTime: Infinity,
        retry: 2,
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });     
}

export const useRevertMatchCalculation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (matchId: string) => {
            return gameService.revertCalculation(matchId);
        },
        onSuccess: () => {
            // cache-t invalidáljuk
            queryClient.invalidateQueries({ queryKey: ["matches"] });
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

