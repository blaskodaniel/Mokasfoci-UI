import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useDialog } from "store/useDialog";
import { useForm } from "react-hook-form";
import { CreatGroupSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IoSaveOutline } from "react-icons/io5";
import { createGroupAction } from "services/actions";
import { toast } from "@/components/ui/use-toast";

const CreateGroupDialog = () => {
  const form = useForm<z.infer<typeof CreatGroupSchema>>({
    resolver: zodResolver(CreatGroupSchema),
    defaultValues: {
      groupname: "",
    },
  });
  const { isOpen, onClose } = useDialog();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: z.infer<typeof CreatGroupSchema>) => {
    try {
      await createGroupAction(values.groupname);
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      form.reset();
      onClose();
      toast({
        description: "Group creation successfully",
      });
    } catch (error) {
      toast({
        description: "Group creation error",
      });
    }
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
              name="groupname"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Group name</FormLabel>
                    <FormControl>
                      <Input placeholder="group name" {...field} />
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

export default CreateGroupDialog;
