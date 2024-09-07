"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { createGroupAction } from "services/actions";

export function CreateForm() {
  const [state, formAction] = useFormState(createGroupAction, null);

  return (
    <>
      <form action={formAction}>
        <input type="text" name="groupname" />
        <Button>Create</Button>
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </div>
      </form>
    </>
  );
}
