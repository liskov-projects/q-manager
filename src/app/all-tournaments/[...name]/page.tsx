"use client";

import QueuesPage from "@/components/Pages/QueuesPage";
import {QueuesProvider} from "@/context/QueuesContext";
import {TournamentProvider} from "@/context/TournamentContext";

export default function TournamentPage({params}: {params: {name: string}}) {
  return (
    <QueuesProvider>
      <TournamentProvider>
        <div>
          <h1 className="text-center text-2xl font-bold">
            Tournament name: {params.name}
          </h1>

          <QueuesPage />
        </div>
      </TournamentProvider>
    </QueuesProvider>
  );
}
