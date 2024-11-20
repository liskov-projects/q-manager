"use client";

import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import NewTournamentForm from "@/components/Forms/NewTournamentForm";
import {QueuesProvider} from "@/context/QueuesContext";
// import {QueuesProvider} from "@/context/QueuesContext";
import {TournamentProvider} from "@/context/TournamentContext";
// import SectionHeader from "@/components/SectionHeader";

export default function AdminPage() {
  return (
    <QueuesProvider>
      <TournamentProvider>
        <div className="flex flex-col">
          <NewTournamentForm />
          <span>Browse Tournaments</span>
          <NewPlayerForm />
        </div>
      </TournamentProvider>
    </QueuesProvider>
  );
}
