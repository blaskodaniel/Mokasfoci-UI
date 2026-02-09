import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useValidationScores } from "hooks/usePlayers";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";

interface ScoreValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const ScoreValidationDialog: FC<ScoreValidationDialogProps> = ({ isOpen, onClose, userId }) => {
  const { data, isLoading, isError } = useValidationScores(userId);
  const isCorrect = data?.data.isCorrect;
  const currentScore = data?.data.currentScores;
  const calculatedScore = data?.data.calculatedScores;
  const differences = data?.data.differences;

  return (
    <Dialog open={isOpen} modal={false} defaultOpen={isOpen}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40"></div>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Játékos pontjainak vizsgálata</DialogTitle>
          <DialogDescription className="text-lg font-semibold text-gray-400 dark:text-gray-300">
            {data?.data.username} - {data?.data.userId}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {isError && (
          <div className="py-8 text-center text-red-500">
            <p>Hiba történt az adatok betöltése közben</p>
          </div>
        )}

        <div>
          <div className="flex gap-3">
            <div>Felhasználható egyenleg:</div>
            <div>
              {isCorrect?.availableScore ? (
                <span className="text-green-600 flex items-center gap-2">
                  <FaRegCircleCheck />
                  Rendben van
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-2">
                  <VscError /> Eltérés van
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div>Nyeremény:</div>
            <div>
              {isCorrect?.profitScore ? (
                <span className="text-green-600 flex items-center gap-2">
                  <FaRegCircleCheck />
                  Rendben van
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-2">
                  <VscError /> Eltérés van
                </span>
              )}
            </div>
          </div>
          {(!isCorrect?.availableScore || !isCorrect?.profitScore) && <div className="h-2 border-t mt-2" />}
          {!isCorrect?.availableScore && (
            <div>
              <div>Eltérést találtunk a felhasználható egyenleg validációja során:</div>
              <div>A játékos jelenlegi pontja: {currentScore?.availableScore}</div>
              <div className="text-red-600">Kalkulált pont: {calculatedScore?.availableScore}</div>
              <div className="text-red-600">Különbség: {differences?.availableScore}</div>
            </div>
          )}
          {!isCorrect?.profitScore && (
            <div>
              <div>Eltérést találtunk a nyeremény validációja során:</div>
              <div>A játékos jelenlegi pontja: {currentScore?.profitScore}</div>
              <div className="text-red-600">Kalkulált pont: {calculatedScore?.profitScore}</div>
              <div className="text-red-600">Különbség: {differences?.profitScore}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" type="button" onClick={onClose} className="px-6">
            Rendben
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreValidationDialog;
