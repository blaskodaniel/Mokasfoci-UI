import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { GetMatchAction, GetTeamsAction } from "services/actions";
import MatchTable from "./table";

const MatchesPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["matches"],
    queryFn: GetMatchAction,
  });
  await queryClient.prefetchQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MatchTable filteredColumnNames={["_id"]} />
    </HydrationBoundary>
  );
};

export default MatchesPage;
