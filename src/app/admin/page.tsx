"use client";

import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import NewTournamentForm from "@/components/Forms/NewTournamentForm";
import {QueuesProvider} from "@/context/QueuesContext";
import {TournamentProvider} from "@/context/TournamentContext";

export default function AdminPage() {
  return (
    <TournamentProvider>
      <QueuesProvider>
        <div className="flex flex-col">
          <NewTournamentForm />
          <span>Browse Tournaments</span>
          <NewPlayerForm />
        </div>
      </QueuesProvider>
    </TournamentProvider>
  );
}
