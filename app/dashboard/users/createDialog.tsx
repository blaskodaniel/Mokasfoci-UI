import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialog } from "store/useDialog";
import { useForm } from "react-hook-form";
import { CreateUserSchema } from "lib/form-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IoSaveOutline } from "react-icons/io5";
import { toast } from "@/components/ui/use-toast";
import { createUserAction } from "services/actions";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "node_modules/@tanstack/react-query/build/modern";

const CreateUserDialog = () => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordAgain: "",
      isAdmin: false,
    },
  });
  const { isOpen, onClose } = useDialog();

  const handleSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    try {
      const { username, password, email, isAdmin } = values;
      await createUserAction({ username, password, email, isAdmin });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.reset();
      onClose();
      toast({
        description: "Sikeresen létrehoztas a játékost",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Nem sikerült lérehozni a játékost!",
      });
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal={false} defaultOpen={isOpen}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40"></div>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="passwordAgain"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3">
                    <FormLabel>Password again</FormLabel>
                    <FormControl>
                      <Input placeholder="password again" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => {
                return (
                  <FormItem className="mb-3 flex gap-3 items-center">
                    <FormLabel className="mt-2">Admin</FormLabel>
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

export default CreateUserDialog;
