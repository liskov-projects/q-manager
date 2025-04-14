"use client";

import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";
import useAddToQueues from "@/hooks/useAddToQueues";
import Button from "./Button";
import { useUser } from "@clerk/nextjs";

export default function ButtonGroup({
  showsFavourites,
  setShowsFavourites,
  showAlternateView,
  setShowAlternateView,
}) {
  const { currentTournament, tournamentOwner } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();
  const { handleRedistributeQueues } = useAddToQueues();
  const { isSignedIn } = useUser();

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center justify-center gap-6 w-full">
        {/* First group: Bulk queue actions */}
        {tournamentOwner && (
          <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
            <Button
              className="bg-bluestone-200 border-2 border-transparent hover:bg-tennis-200 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded text-nowrap font-bold hover:border-2 hover:border-bluestone-200 [text-shadow:_0.5px_0.5px_1px_black]"
              onClick={() => {
                if (socket) {
                  socket.emit("addAllPlayersToQueues", { tournament: currentTournament });
                }
              }}
            >
              ADD ALL
            </Button>
            <Button
              className="bg-bluestone-200 border-2 border-transparent hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded text-nowrap font-bold [text-shadow:_0.5px_0.5px_1px_black] hover:border-2 hover:border-bluestone-200"
              onClick={() => handleRedistributeQueues()}
            >
              REDISTRIBUTE
            </Button>
            <Button
              className="bg-bluestone-200 border-2 border-transparent hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded text-nowrap font-bold [text-shadow:_0.5px_0.5px_1px_black] hover:border-2 hover:border-bluestone-200"
              onClick={() => {
                if (socket) {
                  socket.emit("uprocessAllPlayers", { tournament: currentTournament });
                }
              }}
            >
              UN-QUEUE ALL
            </Button>
            <Button
              className="bg-bluestone-200 border-2 border-transparent hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded text-nowrap font-bold [text-shadow:_0.5px_0.5px_1px_black] hover:border-2 hover:border-bluestone-200"
              onClick={() => {
                if (socket) {
                  socket.emit("processAllPlayers", { tournament: currentTournament });
                }
              }}
            >
              FINISH ALL
            </Button>
          </div>
        )}

        {/* Second group: View toggles */}
        <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
          {tournamentOwner && (
            <Button
              onClick={() => setShowAlternateView(!showAlternateView)}
              className={`font-bold py-2 border-2 border-transparent h-[45px] w-fit px-4 rounded text-nowrap ${
                showAlternateView
                  ? "bg-tennis-200 text-shell-300 border-shell-300 border-2"
                  : "bg-bluestone-200 text-shell-50"
              } hover:text-shell-300 hover:bg-tennis-200`}
            >
              {showAlternateView ? "Show Detailed View" : "Show Grid View"}
            </Button>
          )}

          {isSignedIn && (
            <Button
              className={`font-bold py-2 h-[45px] border-2 border-transparent w-fit px-4 rounded text-nowrap ${
                showsFavourites
                  ? "bg-tennis-200 text-shell-300 border-shell-300 border-2"
                  : "bg-bluestone-200 text-shell-50"
              } hover:text-shell-300 hover:bg-tennis-200`}
              onClick={() => setShowsFavourites(!showsFavourites)}
            >
              {showsFavourites ? "Show All Players" : "Show Favourites Only"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
