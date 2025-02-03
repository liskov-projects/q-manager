// enables the tournamentOwner check
"use client";
import NewQueueForm from "@/components/Forms/NewQueueForm";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/components/Tournaments/TournamentCategories";

export default function TournamentPage({params}: {params: {id: string[]}}) {
  const {tournaments, tournamentOwner} = useTournamentsAndQueuesContext();
  // all are coming through
  // console.log("all tournaments", tournaments);
  // console.log("params", params);

  const tournamentIdInRoute = params.id[0];
  console.log("TOURNAMENT ID IN ROUTE PAGE")
  console.log(params.id[0])

  console.log("TOURNAMENTS")
  console.log(tournaments)

  const currentTournament = tournaments.find(tournament => tournament._id === tournamentIdInRoute);
  // console.log("CURRENT TOURNAMENT", currentTournament);
  
  const { name = "", categories = [] } = currentTournament || {};

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">
        {/* TODO: change */}
        <span>Tournament name: {name}</span>
        <div className="flex, flex-row items-center justify-between mt-2">
          <TournamentCategories categories={categories}>
            Categories:
          </TournamentCategories>
        </div>
      </h1>
      {tournamentOwner && <NewQueueForm />}
      <TournamentQueuesPage thisTournamentId={params.id} />
    </div>
  );
}
