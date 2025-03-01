"use client";
import NewQueueForm from "@/components/Forms/NewQueueForm";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/components/Tournaments/TournamentCategories";
import { SocketProvider, useSocket } from "@/context/SocketContext";
import { useEffect } from "react";

export default function TournamentPage({params}: {params: {id: string[]}}) {
  const {tournaments, tournamentOwner} = useTournamentsAndQueuesContext();
  // VERA IF YOU LIKE
  // const {updateTournamentWithNewPlayer} = useTournamentsAndQueuesContext();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // ✅ Listen for a successful player addition (only for the requesting client)
    socket.on("playerAddedSuccess", ({ message, data }) => {
      console.log("SOCKET SUCCESS ADD PLAYER", message);

      // updateTournamentWithNewPlayer(data.tournamentId, data.playerData)

    });

    // ✅ Listen for tournament updates (broadcasted to all clients)
    // socket.on("tournamentUpdated", ({ tournamentId, change, updatedTournament }) => {
    //   console.log("Tournament update received:", change);

    //   if (change.type === "addPlayer") {
    //     // ✅ Update the local state with the new player
    //     setTournament(updatedTournament);
    //   }
    // });

    // ✅ Listen for errors
    // socket.on("errorMessage", ({ error }) => {
    //   console.error("Error from server:", error);
    //   alert(error); // Show error to user
    // });

    return () => {
      socket.off("playerAddedSuccess");
      socket.off("tournamentUpdated");
      socket.off("errorMessage");
    };
  }, [socket]);
  // all are coming through
  // console.log("all tournaments", tournaments);
  // console.log("params", params);

  const tournamentIdInRoute = params.id[0];
  // console.log("TOURNAMENT ID IN ROUTE PAGE")
  // console.log(params.id[0])

  // console.log("TOURNAMENTS")
  // console.log(tournaments)

  const currentTournament = tournaments.find(
    tournament => tournament._id === tournamentIdInRoute
  );
  console.log("CURRENT TOURNAMENT", currentTournament);

  const {name = "", categories = []} = currentTournament || {};

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">
        <span>Tournament name: {name}</span>
        <div className="flex flex-row justify-center items-center mt-2">
          <TournamentCategories
            categories={categories}
            tournamentId={currentTournament?._id}
          />
        </div>
      </h1>
      {tournamentOwner && <NewQueueForm />}
      <TournamentQueuesPage tournamentId={currentTournament?._id} />
    </div>
  );
}
