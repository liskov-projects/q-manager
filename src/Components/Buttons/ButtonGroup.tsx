"use client";
// hooks
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";
import useAddToQueues from "@/hooks/useAddToQueues";
// components
import Button from "./Button";
import SectionHeader from "../SectionHeader";

export default function ButtonGroup({}) {
  const { currentTournament, tournamentOwner } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();
  const { handleRedistributeQueues } = useAddToQueues();

  // hides the components from guests
  if (!tournamentOwner) return null;

  return (
    <div className="my-1">
      <SectionHeader>Bulk Actions</SectionHeader>
      <div className="flex flex-col justify-around h-auto">
        <div className="flex">
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                socket.emit("addAllPlayersToQueues", {
                  tournament: currentTournament,
                });
              }
              // optimistic UI
              // handleAddAllToQueues(currentTournament);
            }}
          >
            Add all
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              // if (socket) {
              //   socket.emit("redistributePlayers", {
              //     tournament: currentTournament,
              //   });
              handleRedistributeQueues();
            }}
          >
            Redestribute
          </Button>
        </div>
        <div className="flex">
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                console.log("emitting uprocessAllPlayers from the button");
                socket.emit("uprocessAllPlayers", {
                  tournament: currentTournament,
                });
              }
              // optimistic UI
              // handleUnprocessAll(currentTournament);
            }}
          >
            Unprocess all
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                console.log("emitting PROCESSAllPlayers from the button");
                socket.emit("processAllPlayers", {
                  tournament: currentTournament,
                });
              }
              // optimistic UI
              // handleProcessAll(currentTournament);
            }}
          >
            Process all
          </Button>
        </div>
      </div>
    </div>
  );
}
