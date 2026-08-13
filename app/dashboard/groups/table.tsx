"use client";

import { useCallback, useMemo } from "react";
import { GroupColumns } from "./columns";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  DeleteGroupAction,
  GetGroupsAction,
  GetTeamsAction,
  updateGroupAction,
} from "services/actions";
import { Group, Team } from "services/types";
import CreateGroupDialog from "./createDialog";
import { useDialog } from "store/useDialog";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";

const GroupTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames: string[];
}) => {
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
    queryFn: GetTeamsAction,
  });

  const {
    data: groupsData,
    error: groupsError,
    isLoading: groupsLoading,
    refetch: groupsRefetch,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: GetGroupsAction,
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      groupId,
      refreshPath,
    }: {
      groupId: string;
      refreshPath?: string;
    }) => DeleteGroupAction(groupId, refreshPath),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: Group }) =>
      updateGroupAction(groupId, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
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
        }
      );
    },
    [toast, updateMutation]
  );

  const onDelete = useCallback(
    async (groupId: string) => {
      deleteMutation.mutate(
        { groupId, refreshPath: "/dashboard/groups" },
        {
          onSuccess: () => {
            console.log("onDelete successfully");
            toast({
              variant: "destructive",
              description: "Group deleted successfully",
            });
          },
        }
      );
    },
    [deleteMutation, toast]
  );

  const columns = useMemo(
    () => GroupColumns({ onEdit, onDelete, isMobile: !isDesktop }),
    [onDelete, onEdit, isDesktop]
  );

  if (groupsLoading || teamsLoading) {
    return <div>Loading...</div>;
  }

  if (groupsError && Object.keys(groupsError).length > 0) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <h1 className={PageTitle}>Groups</h1>
      <div className="py-5">
        <DataTable
          data={groupsData as Group[]}
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
