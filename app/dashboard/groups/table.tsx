"use client";

import { useCallback, useMemo } from "react";
import { GroupColumns } from "./columns";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { DeleteGroupAction, updateGroupAction } from "services/actions";
import { Group, Team } from "services/types";
import CreateGroupDialog from "./createDialog";
import { useDialog } from "store/useDialog";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import { groupService, teamService } from "services/services";

const GroupTable = ({ filteredColumnNames }: { filteredColumnNames: string[] }) => {
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { onOpen } = useDialog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams().then((res) => res.data),
  });

  const {
    data: groupsData,
    error: groupsError,
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.getGroups().then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (groupId: string) => DeleteGroupAction(groupId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Group deletion failed",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: Group }) => updateGroupAction(groupId, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Group update failed",
      });
    },
  });

  const onEdit = useCallback(
    async (group: Group) => {
      updateMutation.mutate(
        {
          groupId: group._id,
          body: group,
        },
        {
          onSuccess: () => {
            console.log("Update successfully");
            toast({
              description: "Update successfully",
            });
          },
        },
      );
    },
    [toast, updateMutation],
  );

  const onDelete = useCallback(
    async (groupId: string) => {
      deleteMutation.mutate(
        groupId,
        {
          onSuccess: () => {
            console.log("onDelete successfully");
            toast({
              description: "Group deleted successfully",
            });
          },
        },
      );
    },
    [deleteMutation, toast],
  );

  const columns = useMemo(
    () => GroupColumns({ onEdit, onDelete, isMobile: !isDesktop }),
    [onDelete, onEdit, isDesktop],
  );

  if (groupsLoading || teamsLoading) {
    return <div>Loading...</div>;
  }

  if (groupsError || teamsError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <h1 className={PageTitle}>Groups</h1>
      <div className="py-5">
        <DataTable
          data={groupsData ?? []}
          columns={columns}
          teams={teamsData as Team[]}
          filteredColumnNames={filteredColumnNames}
          onOpenDialog={onOpen}
        />
        <CreateGroupDialog />
      </div>
    </>
  );
};

export default GroupTable;
