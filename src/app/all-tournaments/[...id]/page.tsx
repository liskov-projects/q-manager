// enables the tournamentOwner check
"use client";
import NewQueueForm from "@/components/Forms/NewQueueForm";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/components/Tournaments/TournamentCategories";

export default function TournamentPage({params}: {params: {_id: string}}) {
  const {tournaments, tournamentOwner} = useTournamentsAndQueuesContext();
  // all are coming through
  console.log("all tournaments", tournaments);
  console.log("params", params);

  const ID = params.id.toString();
  const currentTournament = tournaments.find(tournament => tournament._id === ID);
  console.log("CURRENT TOURNAMENT", currentTournament);

  const {name, categories} = currentTournament;

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
      <TournamentQueuesPage thisTournamentId={params._id} />
    </div>
  );
}
