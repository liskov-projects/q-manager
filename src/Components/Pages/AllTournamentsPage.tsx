"use client";
import {useState} from "react";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Buttons/Button";
import TournamentCard from "@/components/Tournaments/TournamentCard";
import NewTournamentForm from "@/components/Forms/NewTournamentForm";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";

// FIXME: dev purposes
// import mockTournaments from "@/Data/tournaments";

export default function AllTournamentsPage() {
  const {tournaments, fetchTournaments} = useTournamentsAndQueuesContext();
  const [search, setSearch] = useState("");

  const tournamentsToShow = tournaments.filter(tournament => {
    return (
      search.length === 0 ||
      tournament.name.toLowerCase().includes(search) ||
      tournament.categories.toLoweCase().includes(search) ||
      tournament.description.toLowerCase().includes(search)
    );
  });

  return (
    // FIXME: the grid for both sections
    <div className="flex flex-row items-start justify-around p-8">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <SectionHeader>Tournaments</SectionHeader>
          <Button
            onClick={() => fetchTournaments()}
            className="self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100">
            Refresh
          </Button>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournamentsToShow.map((tournament, index) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start justify-start my-4 p-8 flex-shrink-0">
        <SectionHeader>I&apos;m looking for...</SectionHeader>
        {/* this should be a search field */}
        <input
          className="focus:outline-none focus:ring-2 focus:ring-brick-200 my-4"
          type="text"
          placeholder="player, tournament..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <NewTournamentForm />
      </div>
    </div>
  );
}
