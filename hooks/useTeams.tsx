import { useQuery } from "@tanstack/react-query"
import { axios } from "util/axios";

export const useGetAllFlags = () => {
    return useQuery<string[]>({
        queryKey: ["flags"],
        queryFn: async (): Promise<string[]> => {
            const response = await axios.get("/admin/flags");
            return response.data.data;
        },
        staleTime: Infinity,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });     
}