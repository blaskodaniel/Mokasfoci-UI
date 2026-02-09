"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "@ui/dashboard/table/data-table";
import { PageTitle } from "@ui/global/CommonStyles";
import { DeleteUserAction, GetUsersAction, updateUserAction } from "services/actions";
import { User } from "services/types";
import { UsersColumns } from "./columns";
import { useCallback, useMemo, useState } from "react";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import { toast } from "@/components/ui/use-toast";
import { useDialog } from "store/useDialog";
import CreateUserDialog from "./createDialog";
import ScoreValidationDialog from "./scoreValidationDialog";

const UsersTable = () => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { onOpen } = useDialog();
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
    refetch: usersRefetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: GetUsersAction,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DeleteUserAction(id, "/dashboard/teams"),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: User }) => updateUserAction(id, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onEdit = useCallback(
    async (user: User) => {
      console.log("onEdit: ", user);
      updateMutation.mutate(
        {
          id: user._id,
          body: user,
        },
        {
          onSuccess: () => {
            toast({
              description: "The user is updated",
            });
          },
        },
      );
    },
    [updateMutation],
  );

  const onDelete = useCallback(
    async (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            description: "The user is deleted",
          });
        },
      });
    },
    [deleteMutation],
  );

  const onValidation = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const columns = useMemo(
    () => UsersColumns({ onEdit, onDelete, isMobile: !isDesktop, onValidation }),
    [isDesktop, onDelete, onEdit],
  );

  return (
    <>
      <PageTitle>Users</PageTitle>
      <div className="py-5">
        <DataTable
          data={usersData as User[]}
          columns={columns}
          filteredColumnNames={["username", "email", "name"]}
          hideColumns={{
            win: false,
            draw: false,
            loss: false,
            publicId: false,
            createdAt: false,
            name: false,
          }}
          onOpenDialog={onOpen}
        />
        <CreateUserDialog />
        <ScoreValidationDialog
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          userId={selectedUserId}
        />
      </div>
    </>
  );
};

export default UsersTable;
