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
  const [showSearch, setShowSearch] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    <div className="p-4 w-full flex flex-row items-start justify-between">
      <div className="flex flex-col p-2 w-[75%]">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Tournaments</SectionHeader>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tournamentsToShow.map((tournament, index) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </ul>
      </div>
      <div className="flex flex-col p-2 w-[25%]">
        <SectionHeader>Tournament functions</SectionHeader>
        <div className="md:hidden flex gap-2 mb-4">
          <Button onClick={() => setShowSearch((prev) => !prev)}>
            {showSearch ? "Hide Search" : "Show Search"}
          </Button>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Hide Form" : "New Tournament"}
          </Button>
        </div>
        <div className="shadow-left-bottom-lg flex flex-col items-start justify-start p-4 mt-2 rounded-md">
          <div className="rounded-sm">
            <SectionHeader>Search tournaments:</SectionHeader>
            <input
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 my-3 w-full"
              type="text"
              placeholder="Search for players, tournaments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="shadow-left-bottom-lg p-4 mt-2 rounded-md">
          <NewTournamentForm />
        </div>
      </div>
    </div>
  );
}
