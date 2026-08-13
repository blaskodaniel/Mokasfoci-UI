"use client";

import { useCallback, useMemo } from "react";
import { PageTitle } from "@ui/global/CommonStyles";
import DataTable from "@ui/dashboard/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { GetSettingsAction, updateSettingsAction } from "services/actions";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Breakpoints } from "util/responsive";
import { useDialog } from "store/useDialog";
import { ConfigColumns } from "./columns";

const SettingsTable = ({ filteredColumnNames }: { filteredColumnNames?: string[] }) => {
  const { onOpen } = useDialog();
  const isDesktop = useMediaQuery(`(min-width: ${Breakpoints.tablet})`);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: settingsData,
    error: settingsError,
    isLoading: settingsLoading,
    refetch: settingsRefetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: GetSettingsAction,
  });

  const updateMutation = useMutation({
    mutationFn: ({ configName, value }: { configName: string; value: string }) =>
      updateSettingsAction(configName, value),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const onEdit = useCallback(
    async (row: { key: string; value: any }) => {
      updateMutation.mutate(
        {
          configName: row.key,
          value: row.value,
        },
        {
          onSuccess: () => {
            toast({
              description: "Update successfully",
            });
          },
        },
      );
    },
    [toast, updateMutation],
  );

  const columns = useMemo(() => ConfigColumns({ onEdit, isMobile: !isDesktop }), [onEdit, isDesktop]);

  if (settingsLoading) {
    return <div>Loading...</div>;
  }

  if (settingsError && Object.keys(settingsError).length > 0) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  const settingsArray = Object.entries(settingsData || {}).map(([key, value]) => ({
    key: key,
    value,
  }));

  return (
    <>
      <h1 className={PageTitle}>Tournament config</h1>
      <div className="max-w-[70%]">
        <DataTable data={settingsArray} columns={columns} onOpenDialog={onOpen} />
      </div>
    </>
  );
};

export default SettingsTable;
