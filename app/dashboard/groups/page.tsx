import GroupTable from "./table";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetGroupsAction, GetTeamsAction } from "services/actions";

const GroupsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["groups"],
    queryFn: GetGroupsAction,
  });
  await queryClient.prefetchQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupTable filteredColumnNames={["_id", "name"]} />
    </HydrationBoundary>
  );
};

export default GroupsPage;
