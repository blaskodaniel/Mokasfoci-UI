import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { EditMatchSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IoSaveOutline } from "react-icons/io5";
import { X } from "lucide-react";
import { matchService } from "services/services";
import { toast } from "@/components/ui/use-toast";
import { DateTimePicker } from "@ui/dashboard/components/DateTimePicker/dateTimePicker";
import { Match, Team } from "services/types";
import { MatchOutcome, MatchStatus, MatchType } from "util/enums";
import { useQueryClient } from "@tanstack/react-query";

interface EditMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  match?: Match;
  teams: Team[];
}

const EditMatchDialog = ({ isOpen, onClose, match, teams }: EditMatchDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof EditMatchSchema>>({
    resolver: zodResolver(EditMatchSchema),
    defaultValues: {
      teamA: "",
      teamB: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (match && isOpen) {
      form.reset({
        teamA: match.teamA?._id || "",
        teamB: match.teamB?._id || "",
        advancingTeam: typeof match.advancingTeam === "string" ? match.advancingTeam : match.advancingTeam?._id || "",
        teamAPlaceholder: match.teamAPlaceholder || "",
        teamBPlaceholder: match.teamBPlaceholder || "",
        goalA: match.goalA,
        goalB: match.goalB,
        oddsAwin: match.oddsAwin,
        oddsDraw: match.oddsDraw,
        oddsBwin: match.oddsBwin,
        date: match.date ? new Date(match.date) : new Date(),
        type: match.type || MatchType.GroupStageRound1,
        status: match.status || MatchStatus.disabled,
        outcome: match.outcome,
        location: match.location || "",
        comment: match.comment || "",
        additionalOdds: match.additionalOdds,
        position: match.position,
      });
    }
  }, [match, isOpen, form]);

  const handleSubmit = async (values: z.infer<typeof EditMatchSchema>) => {
    console.log(values);
    if (!match?._id) return;

    const payload = {
      ...values,
      _id: match._id,
      ...(values.teamA ? { teamA: values.teamA } : { teamA: null }),
      ...(values.teamB ? { teamB: values.teamB } : { teamB: null }),
      ...(values.advancingTeam ? { advancingTeam: values.advancingTeam } : { advancingTeam: null }),
    };

    try {
      await matchService.updateMatch(payload as any, match._id);

      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["match-scheduler-status"] });
      onClose();
      toast({
        description: "Mérkőzés sikeresen frissítve",
      });
    } catch (error) {
      toast({
        description: "Hiba történt a mérkőzés frissítése közben",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} modal={false}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40"></div>}
      <DialogContent className="w-[90vw] max-w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[70vw]">
        <DialogHeader>
          <DialogTitle>Mérkőzés szerkesztése</DialogTitle>
          <DialogDescription className="sr-only">Szerkeszd a mérkőzés adatait az alábbi űrlapon</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.log("Validation Errors:", errors);
              toast({
                title: "Validation Error",
                description: "Please check the console for validation errors.",
                variant: "destructive",
              });
            })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Column 1 */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="teamA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hazai csapat</FormLabel>
                    <div className="relative">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-500">
                            <SelectValue placeholder="Válassz csapatot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team._id} value={team._id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="goalA"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hazai gól</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          className="border-slate-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="teamAPlaceholder"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hazai csapat (Placeholder)</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-slate-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamBPlaceholder"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Vendég csapat (Placeholder)</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Típus</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-500">
                          <SelectValue placeholder="Válassz típust" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(MatchType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Státusz</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-500">
                            <SelectValue placeholder="Válassz státuszt" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(MatchStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advancingTeam"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Továbbjutó csapat</FormLabel>
                      <div className="relative">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-slate-500">
                              <SelectValue placeholder="Válassz csapatot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team._id} value={team._id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Helyszín</FormLabel>
                    <FormControl>
                      <Input className="border-slate-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pozíció</FormLabel>
                    <FormControl>
                      <Input className="border-slate-600" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="teamB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendég csapat</FormLabel>
                    <div className="relative">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-500">
                            <SelectValue placeholder="Válassz csapatot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team._id} value={team._id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goalB"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Vendég gól</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                        className="border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="oddsAwin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hazai odds</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oddsDraw"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Döntetlen odds</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oddsBwin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Vendég odds</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="additionalOdds.scoreOdds.exactMatch"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Telitalálat odds</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalOdds.scoreOdds.goalDifference"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Gólkülönbség odds</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalOdds.scoreOdds.outcome"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Csak győztes odds</FormLabel>
                      <FormControl>
                        <Input className="border-slate-500" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Dátum</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          granularity="minute"
                          displayFormat={{ hour24: "MMM dd - HH:mm" }}
                          className="w-full border-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eredmény</FormLabel>
                    <Select onValueChange={field.onChange} value={field?.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="border-slate-500">
                          <SelectValue placeholder="Válassz eredményt" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(MatchOutcome).map((outcome) => (
                          <SelectItem key={outcome} value={outcome}>
                            {outcome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Komment</FormLabel>
                    <FormControl>
                      <Input className="border-slate-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1 sm:col-span-2 flex justify-end mt-4 gap-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Mégsem
              </Button>
              <Button className="bg-emerald-700 hover:bg-emerald-600" variant="outline" type="submit">
                <IoSaveOutline className="mr-2 h-4 w-4" />
                Mentés
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMatchDialog;
