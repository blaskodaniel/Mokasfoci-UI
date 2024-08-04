import { revalidatePath } from "next/cache";
import { groupService } from "services/group-service";
import type { TableProps } from "antd";
import { Group } from "services/service-types";
import { PageTitle, Title } from "@ui/global/CommonStyles";

const GroupsPage = async () => {
  const groups = await groupService.getGroups();

  const columns: TableProps<Group>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const onSubmit = async (formdata: FormData) => {
    "use server";
    const groupname = formdata.get("groupname");
    if (groupname) {
      await groupService.createGroups(groupname as string);
      revalidatePath("/dashboard/groups");
    }
  };

  return (
    <>
      <PageTitle>Groups</PageTitle>
      <pre>{JSON.stringify(groups, null, 4)}</pre>
      <form action={onSubmit}>
        <input type="text" name="groupname" />
        <button>Create</button>
      </form>
    </>
  );
};

export default GroupsPage;
