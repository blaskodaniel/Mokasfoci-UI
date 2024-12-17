import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialog } from "store/useDialog";
import { useForm } from "react-hook-form";
import { CreateTeamSchema, CreatGroupSchema } from "lib/form-definitions";
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
import { createGroupAction, createTeamAction } from "services/actions";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const CreateTeamDialog = () => {
  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: {
      name: "",
      flag: "",
      groupId: "",
      active: false,
    },
  });
  const { isOpen, onClose } = useDialog();

  const handleSubmit = async (values: z.infer<typeof CreateTeamSchema>) => {
    console.log({ ...values, active: !!values.active });
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
              name="groupId"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <Input placeholder="group" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="flag" {...field} />
                    </FormControl>
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
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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

export default CreateTeamDialog;
