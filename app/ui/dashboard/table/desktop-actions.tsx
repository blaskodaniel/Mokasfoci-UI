import { IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import { ITableActionsProps } from "services/types";

function DesktopActions<T>({
  onEdit,
  onDelete,
  rowData,
}: ITableActionsProps<T>) {
  return (
    <div className="flex gap-3">
      <IoSaveOutline
        className="cursor-pointer"
        onClick={() => {
          onEdit(rowData);
        }}
      />
      <IoTrashOutline
        className="cursor-pointer"
        onClick={() => {
          onDelete(rowData);
        }}
      />
    </div>
  );
}

export default DesktopActions;
