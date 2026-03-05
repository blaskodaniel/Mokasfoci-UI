import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiMenuKebab } from "react-icons/ci";
import { MatchTableItem } from "./types";
import { MatchStatus } from "util/enums";
import ConfirmationModal from "components/ConfirmationModal";

interface MatchActionMenuProps {
  match: MatchTableItem;
  onEdit: (match: MatchTableItem) => void;
  onCalculation: (match: MatchTableItem) => void;
  onRevert: (match: MatchTableItem) => void;
  onDelete: (id: string) => void;
}

const MatchActionMenu = ({ match, onEdit, onCalculation, onDelete, onRevert }: MatchActionMenuProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"calculate" | "revert" | "delete" | null>(null);

  const handleAction = (type: "calculate" | "revert" | "delete") => {
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (actionType === "calculate") {
      onCalculation(match);
    } else if (actionType === "revert") {
      onRevert(match);
    } else if (actionType === "delete") {
      onDelete(match._id);
    }
    setModalOpen(false);
    setActionType(null);
  };

  const getModalContent = () => {
    switch (actionType) {
      case "calculate":
        return {
          title: "Mérkőzés kalkulálása",
          description: "Biztosan kalkulálni szeretnéd ezt a mérkőzést? Ez az akció kiértékeli az eredményeket.",
          variant: "default" as const,
        };
      case "revert":
        return {
          title: "Kalkuláció visszavonása",
          description:
            "Biztosan vissza szeretnéd vonni a kalkulációt? Ez az akció érvényteleníti a korábbi eredményeket.",
          variant: "destructive" as const,
        };
      case "delete":
        return {
          title: "Mérkőzés törlése",
          description: "Biztosan törölni szeretnéd ezt a mérkőzést? Ez a művelet nem visszavonható.",
          variant: "destructive" as const,
        };
      default:
        return {
          title: "",
          description: "",
          variant: "default" as const,
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalContent.title}
        description={modalContent.description}
        variant={modalContent.variant}
        confirmText={actionType === "delete" ? "Törlés" : actionType === "revert" ? "Visszavonás" : "Kalkulálás"}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-none">
          <CiMenuKebab />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(match)}>Szerkesztés</DropdownMenuItem>
          {match.isCalculated && (
            <DropdownMenuItem onClick={() => handleAction("revert")}>Kalkuláció visszavonás</DropdownMenuItem>
          )}
          {!match.isCalculated && match.status === MatchStatus.finished && (
            <DropdownMenuItem onClick={() => handleAction("calculate")}>Kalkuláció</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleAction("delete")} className="text-red-500">
            Törlés
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MatchActionMenu;
