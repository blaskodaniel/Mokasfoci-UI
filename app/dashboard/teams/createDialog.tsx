import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialog } from "store/useDialog";
import { useForm } from "react-hook-form";
import { CreateTeamSchema, CreatGroupSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IoSaveOutline } from "react-icons/io5";
import { createTeamAction } from "services/actions";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useGetAllGroups } from "hooks/useGroups";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllFlags } from "hooks/useTeams";

const CreateTeamDialog = () => {
  const { isOpen, onClose } = useDialog();
  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: {
      name: "",
      tla: "",
      flag: "",
      groupid: "",
      active: false,
    },
  });

  const { data: groupsData, error: groupsError, isLoading: groupsLoading } = useGetAllGroups(isOpen);

  const { data: flagsData, error: flagsError, isLoading: flagsLoading } = useGetAllFlags();

  const handleSubmit = async (values: z.infer<typeof CreateTeamSchema>) => {
    await createTeamAction({ ...values, active: !!values.active });
    form.reset(form.getValues());
    onClose();
    toast({
      description: "Team creation successfully",
    });
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Input placeholder="team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="tla"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Team TLA</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="team TLA"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="groupid"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupsLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : groupsError ? (
                          <SelectItem value="error" disabled>
                            Error loading groups
                          </SelectItem>
                        ) : (
                          groupsData?.map((group) => (
                            <SelectItem key={group._id} value={group._id}>
                              {group.name}
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
              name="flag"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Flag</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a flag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {flagsLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : flagsError ? (
                          <SelectItem value="error" disabled>
                            Error loading flags
                          </SelectItem>
                        ) : (
                          flagsData?.map((flag) => (
                            <SelectItem key={flag} value={flag}>
                              {flag}
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
              name="active"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3 flex gap-3 items-center">
                    <FormLabel className="mt-2">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
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

export default CreateTeamDialog;
