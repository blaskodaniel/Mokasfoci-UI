import { IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import { ITableActionsProps } from "services/types";
import { FaCalculator } from "react-icons/fa";
import { MdOutlineSwapVerticalCircle } from "react-icons/md";

function DesktopActions<T>({ onEdit, onDelete, onCalculation, onValidation, rowData }: ITableActionsProps<T>) {
  return (
    <div className="flex gap-3">
      <IoSaveOutline
        className="cursor-pointer"
        onClick={() => {
          onEdit(rowData);
        }}
      />
      {onValidation && (
        <MdOutlineSwapVerticalCircle
          className="cursor-pointer"
          onClick={() => {
            onValidation(rowData);
          }}
        />
      )}
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
