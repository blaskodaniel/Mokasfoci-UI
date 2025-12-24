import { useQuery } from "@tanstack/react-query"
import { Group } from "services/types";
import { axios } from "util/axios";

export const useGetAllGroups = (enabled: boolean = true) => {
    return useQuery<Group[]>({
        queryKey: ["groups"],
        queryFn: async (): Promise<Group[]> => {
            const response = await axios.get("/group/all");
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