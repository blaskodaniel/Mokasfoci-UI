import { groupService } from "services/group-service";
import { PageTitle } from "@ui/global/CommonStyles";
import { CreateForm } from "./createForm";

const GroupsPage = async () => {
  const groups = await groupService.getGroups();

  return (
    <>
      <PageTitle>Groups</PageTitle>
      <pre>{JSON.stringify(groups, null, 4)}</pre>
      <CreateForm />
    </>
  );
};

export default GroupsPage;
