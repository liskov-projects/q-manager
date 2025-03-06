"use client";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/components/Tournaments/TournamentCategories";

export default function TournamentPage({params}: {params: {id: string[]}}) {
  const {tournamentOwner, currentTournament} = useTournamentsAndQueuesContext();

  // console.log("CURRENT TOURNAMENT", currentTournament);

  const {name = "", categories = []} = currentTournament || {};

  return (
    <div>
      <h1 className="text-center text-4xl font-black">
        <span>{name}</span>
        <div className="flex flex-row justify-center items-center mt-1">
          <TournamentCategories
            categories={categories}
            tournamentId={currentTournament?._id}
          />
        </div>
      </h1>
      <TournamentQueuesPage tournamentId={currentTournament?._id} />
    </div>
  );
}
