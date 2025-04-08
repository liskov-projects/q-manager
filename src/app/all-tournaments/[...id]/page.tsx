"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/Components/Pages/TournamentQueuesPage";
import TournamentCategories from "@/Components/Tournaments/TournamentCategories";
import Image from "next/image";
import Header from "@/Components/Header";

export default function TournamentPage() {
  const { currentTournament } = useTournamentsAndQueuesContext();

  // console.log("CURRENT TOURNAMENT", currentTournament);

  const { name = "", categories = [] } = currentTournament || {};

  return (
    <div>
      <div className="flex justify-center items-center">
        <Header>
          <div className="relative w-96 h-40 rounded-lg overflow-hidden">
            {/* Image + Overlay Layer */}
            <div className="w-full h-full relative z-0">
              <Image
                src={currentTournament?.image}
                alt={`Tournament ${name} Image`}
                fill
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute inset-0 bg-shell-75 opacity-80" />
            </div>

            {/* the name on top of the image */}
            <div className="absolute top-12 left-0 w-full text-center z-10">
              <span className="text-bluestone-300 text-4xl font-bold">{name}</span>
            </div>
            <div className="absolute bottom-2 left-2 z-10">
              <TournamentCategories categories={categories} tournamentId={currentTournament?._id} />
            </div>
          </div>
        </Header>
      </div>
      <TournamentQueuesPage tournamentId={currentTournament?._id} />
    </div>
  );
}
