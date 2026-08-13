import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDialog } from "store/useDialog";
import { useForm } from "react-hook-form";
import { CreateMatchSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IoSaveOutline } from "react-icons/io5";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { createMatchAction } from "services/actions";
import { toast } from "@/components/ui/use-toast";
import { DateTimePicker } from "@ui/dashboard/components/DateTimePicker/dateTimePicker";
import { Team } from "services/types";
import { useQueryClient } from "@tanstack/react-query";

const CreateMatchDialog = ({ teams = [] }: { teams?: Team[] }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof CreateMatchSchema>>({
    resolver: zodResolver(CreateMatchSchema),
    defaultValues: {
      teamA: "",
      teamB: "",
      date: new Date(),
    },
  });
  const { isOpen, onClose } = useDialog();
  const [openTeamA, setOpenTeamA] = React.useState(false);
  const [openTeamB, setOpenTeamB] = React.useState(false);

  const handleSubmit = async (values: z.infer<typeof CreateMatchSchema>) => {
    try {
      // Csak a nem üres, nem undefined és nem null értékű mezőket küldjük el
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== undefined && v !== null && v !== ""),
      );
      await createMatchAction(filteredValues);
      form.reset({ teamA: "", teamB: "", date: new Date() });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      onClose();
      toast({
        description: "A mérkőzés sikeresen létrejött",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "A mérkőzés létrehozása sikertelen",
      });
    }
  };

  // Reset form fields when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      form.reset({ teamA: "", teamB: "", date: new Date() });
    }
  }, [isOpen, form]);

  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal={false} defaultOpen={isOpen}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40"></div>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new match</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="teamA"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Home team</FormLabel>
                    <div className="relative">
                      <Popover open={openTeamA} onOpenChange={setOpenTeamA}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? teams.find((team: Team) => team._id === field.value)?.name
                                : "Select a team"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 shadow-lg">
                          <Command>
                            <CommandInput placeholder="Search team..." />
                            <CommandList>
                              <CommandEmpty>No team found.</CommandEmpty>
                              <CommandGroup>
                                {teams.map((team: Team) => (
                                  <CommandItem
                                    key={team._id}
                                    value={team.name}
                                    onSelect={() => {
                                      field.onChange(team._id === field.value ? "" : team._id);
                                      setOpenTeamA(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === team._id ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {team.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {field.value && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            field.onChange("");
                          }}
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="teamB"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Away team</FormLabel>
                    <div className="relative">
                      <Popover open={openTeamB} onOpenChange={setOpenTeamB}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? teams.find((team: Team) => team._id === field.value)?.name
                                : "Select a team"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 shadow-lg">
                          <Command>
                            <CommandInput placeholder="Search team..." />
                            <CommandList>
                              <CommandEmpty>No team found.</CommandEmpty>
                              <CommandGroup>
                                {teams.map((team: Team) => (
                                  <CommandItem
                                    key={team._id}
                                    value={team.name}
                                    onSelect={() => {
                                      field.onChange(team._id === field.value ? "" : team._id);
                                      setOpenTeamB(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === team._id ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {team.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {field.value && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            field.onChange("");
                          }}
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel className="mr-3">Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        granularity="minute"
                        displayFormat={{ hour24: "MMM dd - HH:mm" }}
                        className="w-[180px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button className="mt-5 float-end bg-emerald-700 hover:bg-emerald-600" variant="outline" type="submit">
              <IoSaveOutline className="mr-2 h-4 w-4" />
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMatchDialog;
