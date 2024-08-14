"use client";

import { useFormState } from "react-dom";
import { createGroupAction } from "services/actions";

export function CreateForm() {
  const [state, formAction] = useFormState(createGroupAction, null);

  return (
    <>
      <form action={formAction}>
        <input type="text" name="groupname" />
        <button>Create</button>
      </form>
    </>
  );
}
