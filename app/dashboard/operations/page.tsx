"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
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

  return (
    <>
      <Button
        className="mt-5 bg-red-700 hover:bg-red-600"
        variant="outline"
        type="submit"
        onClick={handleResetGame}
      >
        <RxReset className="mr-2 h-4 w-4" />
        Reset game
      </Button>
    </>
  );
};

export default OperationPage;
