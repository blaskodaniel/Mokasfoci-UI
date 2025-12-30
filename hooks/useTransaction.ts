import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "services/services";
import { CreateTransactionBody } from "services/types";

export const useTransaction = () => {
   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTransactionBody) => {
      return gameService.createTransaction(body);
    },
    onSuccess: () => {
      // cache-t invalidáljuk
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

}