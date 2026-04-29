import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "services/services";
import { CreateTransactionBody } from "services/types";

export const useTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionBody,
      isUpdateProfitScore,
    }: {
      transactionBody: CreateTransactionBody;
      isUpdateProfitScore: boolean;
    }) => {
      return gameService.createTransaction(transactionBody, isUpdateProfitScore);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
