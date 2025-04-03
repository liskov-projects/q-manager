"use client";

import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { TTournament } from "@/types/Types";
import SectionHeader from "@/Components/SectionHeader";
import Button from "@/Components/Buttons/Button";
import TournamentCard from "@/Components/Tournaments/TournamentCard";
import NewTournamentForm from "@/Components/Forms/NewTournamentForm";

export default function AllTournamentsPage() {
  const { tournaments } = useTournamentsAndQueuesContext();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const tournamentsToShow = tournaments
    .filter((tournament: TTournament) => {
      const foundName = tournament.name.toLowerCase().startsWith(search.toLowerCase());
      if (!tournament.description) return false;
      const foundDescription = tournament.description.includes(search.toLowerCase());
      return foundName || foundDescription;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-4 w-full flex flex-col lg:flex-row gap-4">
      {/* Tournament Functions - on top for mobile, on right for desktop */}
      <div className="w-full lg:w-[25%] flex flex-col gap-4 order-1 lg:order-2">
        <SectionHeader>Tournament functions</SectionHeader>

        <div className="flex gap-2 mb-2 lg:hidden">
          <Button onClick={() => setShowSearch((prev) => !prev)}>
            {showSearch ? "Hide Search" : "Show Search"}
          </Button>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Hide Form" : "New Tournament"}
          </Button>
        </div>

        {(showSearch || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <div className="shadow-left-bottom-lg flex flex-col items-start p-4 rounded-md">
            <SectionHeader>Search tournaments:</SectionHeader>
            <input
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 mt-2 w-full"
              type="text"
              placeholder="Search for players, tournaments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {(showForm || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <div className="shadow-left-bottom-lg p-4 rounded-md">
            <NewTournamentForm />
          </div>
        )}
      </div>

      {/* Tournaments List - second on mobile, first on desktop */}
      <div className="flex-1 order-2 lg:order-1">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Tournaments</SectionHeader>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tournamentsToShow.map((tournament, index) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </ul>
      </div>
    </div>
  );
}
