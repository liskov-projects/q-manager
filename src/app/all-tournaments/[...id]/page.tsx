"use client";
import NewQueueForm from "@/components/Forms/NewQueueForm";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/components/Tournaments/TournamentCategories";
import {useSocket} from "@/context/SocketContext";
import {useEffect} from "react";

export default function TournamentPage({params}: {params: {id: string[]}}) {
  const {tournaments, tournamentOwner} = useTournamentsAndQueuesContext();
  // VERA IF YOU LIKE
  const {fetchNewPlayers, addPlayerToTournament} = useTournamentsAndQueuesContext();
  // NEW:
  const socket = useSocket();
  const tournamentIdInRoute = params.id[0];
  // all are coming through
  // console.log("all tournaments", tournaments);
  // console.log("params", params);

  // NEW:
  // useEffect(() => {
  //   console.log("socket setup RAN in USEEFFECT");
  //   if (!socket) return;

  //   socket.on("tournamentUpdated", () => {
  //     console.log("tournamnet updated recieved at the front");
  //   });

  //   socket.on("playerAdded", ({message, data}) => {
  //     console.log("this is the MESSAGE: ", message, "this is the DATA: ", data);
  //     addPlayerToTournament(data, tournamentIdInRoute);
  //   });
  //   // return () => {
  //   //   socket.offAny("playerAdded");
  //   // };
  //   // return () => socket.disconnect();
  //   return;
  // }, []);

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
