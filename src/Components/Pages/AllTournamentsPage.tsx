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
        <div className="flex items-center justify-between">
          {/* FIXME: layout should be */}
          {/* MANAGED TOURNAMENTS */}
          {/* FAVED TOURNAMENTS */}
          {/* ALL TOURN  */}
          <SectionHeader>Tournaments</SectionHeader>
          {/* <Button
            onClick={() => fetchTournaments()}
            className="self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100"
          >
            Refresh
          </Button> */}
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournamentsToShow.map((tournament, index) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </ul>
      </div>
      <div className="bg-slate-300 flex flex-col items-start justify-start p-2">
        <div className="bg-slate-400 px-3 py-2 rounded-sm">
          <SectionHeader>Search tournaments:</SectionHeader>
          {/* this should be a search field */}
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
  );
}
