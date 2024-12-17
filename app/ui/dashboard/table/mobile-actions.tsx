import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { ITableActionsProps } from "services/types";

function MobileActions<T>({
  onEdit,
  onDelete,
  rowData,
}: ITableActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <BiDotsHorizontalRounded className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onEdit(rowData);
          }}
        >
          Save
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDelete(rowData);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MobileActions;
