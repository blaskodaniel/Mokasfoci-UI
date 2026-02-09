import { useQuery } from "@tanstack/react-query";
import { userService } from "services/services";
import { User, UserScoresValidationResponse } from "services/types";

export const useGetAllPlayers = (enabled: boolean = true) => {
  return useQuery<User[]>({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await userService.getUsers();
      return response.data;
    },
    staleTime: Infinity,
    retry: 2,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useValidationScores = (userId?: string | null) => {
  return useQuery<UserScoresValidationResponse>({
    queryKey: ["player-score-validation", userId],
    queryFn: async () => {
      const response = await userService.userScoresValidation(userId!);
      return response.data;
    },
    enabled: !!userId,
  });
};
