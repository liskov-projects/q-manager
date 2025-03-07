"use client";
// hooks
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import useAddToQueues from "@/hooks/useAddToQueues";
import {useSocket} from "@/context/SocketContext";
// components
import Button from "./Button";
import SectionHeader from "../SectionHeader";

export default function ButtonGroup({tournamentId}) {
  const {currentTournament, tournamentOwner, saveTournament} =
    useTournamentsAndQueuesContext();
  const {socket} = useSocket();

  const {
    handleAddAllToQueues,
    handleRedistributeQueues,
    handleProcessAll,
    handleUnprocessAll
  } = useAddToQueues();

  // hides the components from guests
  if (!tournamentOwner) return null;

  return (
    <div className="my-4">
      <SectionHeader>Button Group</SectionHeader>
      <div className="flex flex-col justify-around h-50 my-12">
        <div className="flex">
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[800px] px-4 rounded my-2 mx-2 min-w-30 text-nowrap"
            onClick={() => {
              if (socket) {
                socket.emit("addAllPlayersToQueues", {
                  tournament: currentTournament
                });
              }
              // optimistic UI
              // handleAddAllToQueues(currentTournament);
            }}>
            Add all
          </Button>
          <Button
            className="bg-brick-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              handleRedistributeQueues();
            }}>
            Redestribute
          </Button>
        </div>
        <div className="flex">
          <Button
            className="bg-brick-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              if (socket) {
                console.log("emitting uprocessAllPlayers from the button");
                socket.emit("uprocessAllPlayers", {
                  tournament: currentTournament
                });
              }
              // optimistic UI
              // handleUnprocessAll(currentTournament);
            }}>
            Unprocess all
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              handleProcessAll(currentTournament);
            }}>
            Process all
          </Button>
        </div>
        <Button
          onClick={() => saveTournament(tournamentId)}
          className="flex-grow bg-tennis-200 hover:bg-tennis-100 text-shell-300 hover:text-shell-200 py-2 h-[45px] px-4 rounded my-2 mx-2">
          SAVE tournament
        </Button>
      </div>
    </div>
  );
}
