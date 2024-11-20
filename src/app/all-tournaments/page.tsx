"use client";
import {TournamentProvider} from "@/context/TournamentContext";
import AllTournamentsPage from "@/components/Pages/AllTournamentsPage";
import {QueuesProvider} from "@/context/QueuesContext";

// FIXME: dev purposes
// import mockTournaments from "@/Data/tournaments";

export default function AllTournaments() {
  // const {tournaments, fetchTournaments} = useTournamentContext();
  return (
    <TournamentProvider>
      <QueuesProvider>
        <AllTournamentsPage />
      </QueuesProvider>
    </TournamentProvider>
  );
}
