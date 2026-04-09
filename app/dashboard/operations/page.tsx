"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { IoMdSync } from "react-icons/io";
import { RxReset } from "react-icons/rx";
import { gameService, userService } from "services/services";
import { useState, useEffect } from "react";
import { User } from "services/types";
import { NotificationType } from "util/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IoIosSend } from "react-icons/io";

const OperationPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [notificationText, setNotificationText] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.system);
  const [actionUrl, setActionUrl] = useState("");

  useEffect(() => {
    userService.getUsers().then(res => {
      setUsers(res.data);
    }).catch(err => {
      console.error("Error fetching users:", err);
    });
  }, []);

  const handleSendNotification = async () => {
    if (!notificationText.trim()) {
      toast({ description: "Az értesítés szövege kötelező!", variant: "destructive" });
      return;
    }
    
    try {
      const response = await gameService.createNotification({
          userid: selectedUserId,
          text: notificationText,
          type: notificationType,
          actionUrl: actionUrl || undefined
      });
      
      if (response.status === 200) {
          toast({ description: "Értesítés(ek) elküldve!" });
          setNotificationText("");
          setActionUrl("");
      } else {
          toast({ description: "Hiba az értesítés küldésekor", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({ description: "Kritikus hiba az értesítés küldésekor", variant: "destructive" });
    }
  };

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
      <section className="pl-2 pb-5 border-b">
        <div className="text-xl font-bold pb-2">Értesítés küldése</div>
        <div className="text-sm text-gray-400 mb-4">Értesítést lehet küldeni a játékosoknak vagy csak egy játékosnak.</div>
        
        <div className="flex flex-col space-y-4 max-w-xl">
          <textarea 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Üzenet szövege..." 
            rows={4}
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz játékost" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">Minden játékos</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user._id} value={user._id}>{user.username}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={notificationType} onValueChange={(val) => setNotificationType(val as NotificationType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Értesítés típusa" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(NotificationType).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Input 
            placeholder="Akció URL (opcionális)..." 
            value={actionUrl}
            onChange={(e) => setActionUrl(e.target.value)}
          />

          <Button
            className="w-fit bg-slate-600 hover:bg-slate-500"
            variant="outline"
            onClick={handleSendNotification}
          >
            <IoIosSend className="mr-2 h-4 w-4" />
            Küldés
          </Button>
        </div>
      </section>
    </>
  );
};

export default OperationPage;
