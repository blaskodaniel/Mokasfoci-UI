import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMatchInfo } from "hooks/useMatches";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaPercentage, FaTrophy, FaCalculator } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { Loader2 } from "lucide-react";
import { Match } from "services/types";

interface MatchInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
}

const MatchInfoDialog = ({ match, isOpen, onClose }: MatchInfoDialogProps) => {
  const matchId = match?._id || "";
  const { data, isLoading, isError } = useGetMatchInfo(matchId);
  const matchInfo = data?.data;

  const teamAName = match?.teamA?.name || match?.teamAPlaceholder || "-";
  const teamBName = match?.teamB?.name || match?.teamBPlaceholder || "-";

  return (
    <Dialog open={isOpen} modal={false} defaultOpen={isOpen}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40"></div>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Fogadási információk</DialogTitle>
          <DialogDescription className="text-lg font-semibold text-gray-400 dark:text-gray-300">
            {teamAName} - {teamBName}
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

        {matchInfo && !isLoading && (
          <div className="space-y-4">
            {/* Calculation Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  matchInfo.isCalculated
                    ? "bg-green-500/20 text-green-600 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-600 border border-gray-500/30"
                }`}
              >
                <FaCalculator className="h-4 w-4" />
                <span className="font-semibold">{matchInfo.isCalculated ? "Calculated" : "No calculated"}</span>
              </div>
              <div>
                <div>
                  ID: <code>{matchId}</code>
                </div>
              </div>
            </div>

            {/* Players Statistics and Bet Percentage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Players Statistics */}
              <div
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 
              border border-blue-500/20 rounded-lg px-3 py-2 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FaUsers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Fogadók / Összes játékos</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-blue-600">{matchInfo.playersWhoBet}</p>
                      <span className="text-2xl text-gray-400">/</span>
                      <p className="text-2xl font-bold text-gray-500">{matchInfo.totalPlayers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bet Percentage */}
              <div
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 
              border border-purple-500/20 rounded-lg px-3 py-2 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FaPercentage className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fogadási arány</p>
                      <p className="text-2xl font-bold text-purple-600">{matchInfo.betPercentage}%</p>
                    </div>
                  </div>
                  <div className="w-14 h-14">
                    <svg className="transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-purple-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${(parseFloat(matchInfo.betPercentage) * 251.2) / 100} 251.2`}
                        className="text-purple-600"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <FaTrophy className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Helyes tippek</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">{matchInfo.correctPredictions}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <FaTimesCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Rossz tippek</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{matchInfo.incorrectPredictions}</p>
              </div>
            </div>

            {/* Max Win Amount */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <BiMoney className="h-7 w-7 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Legnagyobb nyeremény</p>
                  <p className="text-3xl font-bold text-yellow-600">{matchInfo.maxWinAmount.toLocaleString()} pont</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="outline" type="button" onClick={onClose} className="px-6">
            Rendben
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchInfoDialog;
