import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { GetSettingsAction } from "services/actions";
import TeamsTable from "./table";
import SettingsTable from "./table";

const SettingsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: GetSettingsAction,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingsTable />
      </HydrationBoundary>
    </>
  );
};

export default SettingsPage;
