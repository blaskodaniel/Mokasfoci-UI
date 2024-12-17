import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";

const AddButton = ({ onDialog }: { onDialog: () => void }) => {
  return (
    <div className="float-end">
      <Button
        className="bg-emerald-700 hover:bg-emerald-600"
        variant="outline"
        onClick={onDialog}
      >
        <HiOutlinePlus className="mr-2 h-4 w-4" /> Add
      </Button>
    </div>
  );
};

export default AddButton;
