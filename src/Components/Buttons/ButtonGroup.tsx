"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";
import useAddToQueues from "@/hooks/useAddToQueues";
import Button from "./Button";
import SectionHeader from "../SectionHeader";

export default function ButtonGroup({
  showsFavourites,
  setShowsFavourites,
  showAlternateView,
  setShowAlternateView,
}) {
  const { currentTournament, tournamentOwner } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();
  const { handleRedistributeQueues } = useAddToQueues();

  // hides the components from guests
  if (!tournamentOwner) return null;

  return (
    <div className="my-4">
      <SectionHeader>Bulk Actions</SectionHeader>
      <div className="flex flex-row justify-around h-auto">
        <div className="flex flex-wrap justify-center">
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                socket.emit("addAllPlayersToQueues", {
                  tournament: currentTournament,
                });
              }
            }}
          >
            Add all
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => handleRedistributeQueues()}
          >
            Redistribute
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                socket.emit("uprocessAllPlayers", { tournament: currentTournament });
              }
            }}
          >
            Unprocess all
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-fit px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                socket.emit("processAllPlayers", { tournament: currentTournament });
              }
            }}
          >
            Process all
          </Button>
          <Button
            onClick={() => setShowAlternateView(!showAlternateView)}
            className={`py-2 h-[45px] w-fit px-4 rounded my-2 mx-2 text-nowrap ${showAlternateView ? "bg-tennis-200 text-shell-300 border-shell-300 border-2" : "bg-bluestone-200 text-shell-50"} text-shell-200 hover:text-shell-300 hover:bg-tennis-200`}
          >
            {showAlternateView ? "Show Detailed View" : "Show Grid View"}
          </Button>
          <Button
            className={`py-2 h-[45px] w-fit px-4 rounded my-2 mx-2 text-nowrap ${showsFavourites ? "bg-tennis-200 text-shell-300 border-shell-300 border-2" : "bg-bluestone-200 text-shell-50"} text-shell-200 hover:text-shell-300 hover:bg-tennis-200`}
            onClick={() => setShowsFavourites(!showsFavourites)}
          >
            {showsFavourites ? "Show All Players" : "Show Favourites Only"}
          </Button>
        </div>
      </div>
    </div>
  );
}
