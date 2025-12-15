import { IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import { ITableActionsProps } from "services/types";
import { FaCalculator } from "react-icons/fa";

function DesktopActions<T>({
  onEdit,
  onDelete,
  onCalculation,
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
      {onCalculation && (
        <FaCalculator
          className="cursor-pointer"
          onClick={() => {
            onCalculation(rowData);
          }}
        />
      )}
      {onDelete && (
        <IoTrashOutline
          className="cursor-pointer text-red-500"
          onClick={() => {
            onDelete(rowData);
          }}
        />
      )}
    </div>
  );
}

export default DesktopActions;
