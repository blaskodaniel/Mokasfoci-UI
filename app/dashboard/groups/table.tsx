"use client";

import { useCallback, useMemo } from "react";
import { GroupColumns } from "./columns";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  DeleteGroupAction,
  GetGroupsAction,
  GetTeamsAction,
} from "services/actions";
import { Group, Team } from "services/types";

const GroupTable = ({
  filteredColumnNames,
}: {
  filteredColumnNames: string[];
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
    refetch: teamsRefetch,
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

  const onEdit = useCallback(async (value: string) => {
    console.log("onEdit: ", value);
  }, []);

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
    () => GroupColumns({ onEdit, onDelete }),
    [onDelete, onEdit]
  );

  if (groupsLoading) {
    return <div>Loading...</div>;
  }

  if (groupsError && Object.keys(groupsError).length > 0) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  console.table(groupsData);

  return (
    <>
      <PageTitle>Groups</PageTitle>
      <div className="py-5">
        <DataTable
          data={groupsData as Group[]}
          columns={columns}
          teams={teamsData as Team[]}
          filteredColumnNames={filteredColumnNames}
        />
      </div>
    </>
  );
};

export default GroupTable;
