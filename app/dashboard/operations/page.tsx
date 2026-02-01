"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { IoMdSync } from "react-icons/io";
import { RxReset } from "react-icons/rx";
import { gameService } from "services/services";

const OperationPage = () => {
  const handleResetGame = async () => {
    try {
      const response = await gameService.resetGame();

      if (response.status === 200) {
        console.log("Game reset successfully");
        toast({
          description: "Game reset successfully!",
        });
      } else {
        console.error("Failed to reset the game");
        toast({
          description: "Failed to reset the game",
        });
      }
    } catch (error) {
      console.error("Error resetting the game:", error);
    }
  };

  const handleSnycTeams = async () => {
    try {
      const response = await gameService.syncTeams();

      if (response.status === 200) {
        console.log("Teams synced successfully");
        toast({
          description: "Teams synced successfully!",
        });
      } else {
        console.error("Failed to sync teams");
        toast({
          description: "Failed to sync teams",
        });
      }
    } catch (error) {
      console.error("Error syncing teams:", error);
    }
  };

  return (
    <>
      <section className="pl-2 pb-5 border-b">
        <div className="text-xl font-bold pb-2">Reset game</div>
        <div className="text-sm text-gray-400">
          <ul className="list-disc list-inside space-y-1">
            <li>Minden user pontjainak alaphelyzetbe állítása</li>
            <li>
              Minden meccs kalkulációs állapotának visszaállítása (isCalculated:false, status: enabled, outcome: null,
              goalA: null, goalB: null)
            </li>
            <li>Minden fogadás törlése</li>
            <li>Minden tranzakció törlése</li>
          </ul>
        </div>
        <div>
          <Button
            className="mt-5 bg-red-700 hover:bg-red-600"
            variant="outline"
            type="submit"
            onClick={handleResetGame}
          >
            <RxReset className="mr-2 h-4 w-4" />
            Reset game
          </Button>
        </div>
      </section>
      <section className="pl-2 pb-5 border-b">
        <div className="text-xl font-bold pb-2">Csapatok szinkronizálása</div>
        <div className="text-sm text-gray-400">
          <ul className="list-disc list-inside space-y-1">
            <li>Minden csapat adatai szinkronizálva lesznek a football-data.org API alapján</li>
            <li>
              Mezőnevek amik frissítve lesznek: position, playedGames, win, draw, loss, getgoal, kickgoal,
              goalDifference, score
            </li>
            <li>Az egyezést a tla mező alapján ellenőrzi</li>
            <li>Ez a szinkronizáció minden kalkuláció után is lefut</li>
          </ul>
        </div>
        <div>
          <Button
            className="mt-5 bg-slate-600 hover:bg-slate-500"
            variant="outline"
            type="submit"
            onClick={handleSnycTeams}
          >
            <IoMdSync className="mr-2 h-4 w-4" />
            Szinkronizálás
          </Button>
        </div>
      </section>
    </>
  );
};

export default OperationPage;
