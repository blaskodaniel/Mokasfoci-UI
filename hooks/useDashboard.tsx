import { useQuery } from "@tanstack/react-query";
import { gameService } from "services/services";
import { DashboardStats } from "services/types";

export const useGetDasboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardstats"],
    queryFn: async () => {
      const response = await gameService.getDashboardStats();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  });
};
