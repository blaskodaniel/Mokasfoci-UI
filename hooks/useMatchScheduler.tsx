import { useQuery } from "@tanstack/react-query";
import { MatchSchedulerService, userService } from "services/services";
import { GetSchedulerStatusResponse, User } from "services/types";

export const useGetStatus = () => {
    return useQuery<GetSchedulerStatusResponse>({
        queryKey: ["match-scheduler-status"],
        queryFn: async () => {
            const response = await MatchSchedulerService.getStatus();
            return response.data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 2,
        refetchOnWindowFocus: true,
    });     
}