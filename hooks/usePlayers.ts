import { useQuery } from "@tanstack/react-query";
import { userService } from "services/services";
import { User } from "services/types";

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
}