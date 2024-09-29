import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { GetTeamsAction } from "services/actions";
import TeamsTable from "./table";

const TeamsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["teams"],
    queryFn: GetTeamsAction,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TeamsTable filteredColumnNames={["name"]} />
      </HydrationBoundary>
    </>
  );
};

export default TeamsPage;
