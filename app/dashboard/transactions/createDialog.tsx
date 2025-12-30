import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialog } from "store/useDialog";
import { useForm } from "react-hook-form";
import { CreateTransactionSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoSaveOutline } from "react-icons/io5";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllPlayers } from "hooks/usePlayers";
import { useGetAllMatches } from "hooks/useMatches";
import { TransactionType } from "util/enums";
import { useTransaction } from "hooks/useTransaction";

const CreateTransactionDialog = () => {
  const { isOpen, onClose } = useDialog();
  const form = useForm<z.infer<typeof CreateTransactionSchema>>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      userid: "",
      amount: 0,
      comment: "",
      type: TransactionType.correction,
      matchid: "",
      couponid: "",
    },
  });
  
  const {
      data: playersData,
      error: playersError,
      isLoading: playersLoading,
    } = useGetAllPlayers(isOpen);

  const {
      data: matchesData,
      error: matchesError,
      isLoading: matchesLoading,
  } = useGetAllMatches(isOpen);

  const transactionMutation = useTransaction()


  const handleSubmit = async (values: z.infer<typeof CreateTransactionSchema>) => {
    // Üres mezők eltávolítása
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => 
        value !== "" && value !== null && value !== undefined && value !== "_none"
      )
    );
    
    await transactionMutation.mutateAsync(cleanedValues as any);
    form.reset(form.getValues());
    onClose();
    toast({
      description: "Transaction creation successfully",
    });
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="userid"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Player</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a player" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {playersLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : playersError ? (
                          <SelectItem value="error" disabled>
                            Error loading players
                          </SelectItem>
                        ) : (
                          playersData?.map((player) => (
                            <SelectItem key={player._id} value={player._id}>
                              {player.username}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TransactionType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comment"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="matchid"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Match (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a match" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_none">None</SelectItem>
                        {matchesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : matchesError ? (
                          <SelectItem value="error" disabled>
                            Error loading matches
                          </SelectItem>
                        ) : (
                          matchesData?.map((match) => (
                            <SelectItem key={match._id} value={match._id}>
                              {match.teamA?.name} - {match.teamB?.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="couponid"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Coupon ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Coupon ID"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              className="mt-5 float-end bg-emerald-700 hover:bg-emerald-600"
              variant="outline"
              type="submit"
            >
              <IoSaveOutline className="mr-2 h-4 w-4" />
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
