"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/Components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/Components/Tournaments/TournamentCategories";
import Image from "next/image";

export default function TournamentPage() {
  const { currentTournament } = useTournamentsAndQueuesContext();

  // console.log("CURRENT TOURNAMENT", currentTournament);

  const { name = "", categories = [] } = currentTournament || {};

  return (
    <div>
      <div className="flex justify-center items-center">
        <Image
          src={currentTournament?.image}
          alt={`Tournament ${name} Image`}
          width={200}
          height={80}
          className="object-cover rounded-md mr-3"
        />
        <h1 className="text-center text-4xl font-black mr-3">
          <span>{name}</span>
        </h1>
        <div className="flex flex-row justify-center items-center mt-1">
          <TournamentCategories categories={categories} tournamentId={currentTournament?._id} />
        </div>
      </div>
      <TournamentQueuesPage tournamentId={currentTournament?._id} />
    </div>
  );
}
