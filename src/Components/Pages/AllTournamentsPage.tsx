"use client";
// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TTournament } from "@/types/Types";
// components
import SectionHeader from "@/Components/SectionHeader";
import Button from "@/Components/Buttons/Button";
import TournamentCard from "@/Components/Tournaments/TournamentCard";
import NewTournamentForm from "@/Components/Forms/NewTournamentForm";

// FIXME: dev purposes
// import mockTournaments from "@/Data/tournaments";

export default function AllTournamentsPage() {
  const { tournaments, fetchTournaments } = useTournamentsAndQueuesContext();
  const [search, setSearch] = useState("");

  const tournamentsToShow = tournaments
    .filter((tournament: TTournament) => {
      const searchLower = search.toLowerCase();

      return (
        search.length === 0 ||
        tournament.name.toLowerCase().includes(searchLower) ||
        tournament.description.toLowerCase().includes(searchLower) ||
        tournament.categories.some((category: string) =>
          category.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((tournamentA: TTournament, tournamentB: TTournament) =>
      tournamentA.name.localeCompare(tournamentB.name)
    );

  return (
    // FIXME: the grid for both sections
    <div className="p-4 w-full flex flex-row items-start justify-around">
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Tournaments</SectionHeader>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournamentsToShow.map((tournament, index) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </ul>
      </div>
      <div className="flex flex-col p-2">
        <SectionHeader>Tournament functions</SectionHeader>
        <div className="shadow-left-bottom-lg flex flex-col items-start justify-start p-4 mt-2 rounded-md">
          <div className="px-3 py-2 rounded-sm">
            <SectionHeader>Search tournaments:</SectionHeader>
            <input
              className="focus:outline-none focus:ring-2 focus:ring-brick-200 my-4"
              type="text"
              placeholder="player, tournament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NewTournamentForm />
        </div>
      </div>
    </div>
  );
}
