import TeamsTable from "@ui/dashboard/teams/TeamsTable";
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { GetTeamsAction } from "services/actions";

const TeamsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });
  return (
    <>
      <h1>Teams</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TeamsTable />
      </HydrationBoundary>
    </>
  );
};

export default TeamsPage;
