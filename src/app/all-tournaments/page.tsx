"use client";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Buttons/Button";
import Tournament from "@/components/Tournaments/Tournament";
import NewTournamentForm from "@/components/Forms/NewTournamentForm";
import {useTournamentContext} from "@/context/TournamentContext";

// FIXME: dev purposes
// import mockTournaments from "@/Data/tournaments";

export default function AllTournaments() {
  const {tournaments, fetchTournaments} = useTournamentContext();

  return (
    // FIXME: the grid for both sections
    <div className="flex flex-row items-start justify-around p-8">
      <div className="flex flex-col">
        <SectionHeader>All tournaments</SectionHeader>
        <Button
          onClick={() => fetchTournaments()}
          className="self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100">
          Refresh
        </Button>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tournaments.map((tournamnet, ind) => (
            <Tournament key={ind} tournament={tournamnet} />
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start justify-start my-4 p-8 flex-shrink-0">
        <SectionHeader>I&apos;m looking for...</SectionHeader>
        {/* this should be a search field */}
        <input type="text" placeholder="player, tournament..." />
        <NewTournamentForm />
      </div>
    </div>
  );
}
