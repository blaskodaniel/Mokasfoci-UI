import { PageTitle } from "@ui/global/CommonStyles";
import { matchService } from "services/match-service";
import { teamService } from "services/team-service";
import { MatchColumns } from "./columns";
import DataTable from "@ui/dashboard/table/data-table";

const MatchesPage = async () => {
  const matches = await matchService.getMatches();
  const teams = await teamService.getTeams();

  return (
    <>
      <PageTitle>Matches</PageTitle>
      <div className="py-5">
        <DataTable data={matches} columns={MatchColumns} teams={teams.data} />
      </div>
    </>
  );
};

export default MatchesPage;
