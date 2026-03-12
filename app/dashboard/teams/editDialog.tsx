import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { EditTeamSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { IoSaveOutline } from "react-icons/io5";
import { updateTeamAction } from "services/actions";
import { toast } from "@/components/ui/use-toast";
import { Group, Team } from "services/types";
import { useQueryClient } from "@tanstack/react-query";

interface EditTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
  groups: Group[];
}

const EditTeamDialog = ({ isOpen, onClose, team, groups }: EditTeamDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof EditTeamSchema>>({
    resolver: zodResolver(EditTeamSchema),
    defaultValues: {
      name: "",
      tla: "",
      flag: "",
      groupid: "",
    },
  });

  useEffect(() => {
    if (team && isOpen) {
      form.reset({
        name: team.name || "",
        tla: team.tla || "",
        flag: team.flag || "",
        groupid: team.groupid?._id || "",
        win: team.win || 0,
        draw: team.draw || 0,
        loss: team.loss || 0,
        score: team.score || 0,
        getgoal: team.getgoal || 0,
        kickgoal: team.kickgoal || 0,
        active: team.active || false,
        isTournamentWinner: team.isTournamentWinner || false,
        position: team.position || 0,
        playedGames: team.playedGames || 0,
        goalDifference: team.goalDifference || 0,
      });
    }
  }, [team, isOpen, form]);

  const handleSubmit = async (values: z.infer<typeof EditTeamSchema>) => {
    if (!team?._id) return;

    // Convert undefined to null or just pass values depending on how backend works
    await updateTeamAction(team._id, values as any);

    queryClient.invalidateQueries({ queryKey: ["teams"] });
    onClose();
    toast({
      description: "Csapat sikeresen frissítve",
    });
  };

  return (
    <Dialog open={isOpen} modal={false}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40"></div>}
      <DialogContent className="w-[90vw] max-w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[70vw]">
        <DialogHeader>
          <DialogTitle>Csapat szerkesztése</DialogTitle>
          <DialogDescription className="sr-only">Szerkeszd a csapat adatait</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.log("Validation Errors:", errors);
              toast({
                title: "Validation Error",
                description: "Hiányzó vagy hibás mezők.",
                variant: "destructive",
              });
            })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Column 1 */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Név</FormLabel>
                    <FormControl>
                      <Input className="border-slate-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="tla"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Rövidítés (TLA)</FormLabel>
                      <FormControl>
                        <Input className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flag"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zászló kód (Flag)</FormLabel>
                      <FormControl>
                        <Input className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="groupid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Csoport</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="border-slate-600">
                          <SelectValue placeholder="Válassz csoportot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group._id} value={group._id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2 pt-2">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1 border border-slate-600 p-3 rounded-md">
                      <FormLabel className="pb-2">Aktív</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isTournamentWinner"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1 border border-slate-600 p-3 rounded-md">
                      <FormLabel className="pb-2">Torna győztes</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="playedGames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lejátszott (M)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pont (P)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="win"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Győzelem (Gy)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="draw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Döntetlen (D)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vereség (V)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kickgoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lőtt gól (LG)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="getgoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapott gól (KG)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goalDifference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gólkülönbség (GK)</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-slate-600" {...field} />
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
                        <Input type="number" className="border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default EditTeamDialog;
