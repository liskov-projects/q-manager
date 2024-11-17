"use client";

import QueuesPage from "@/components/Pages/QueuesPage";
import {QueuesProvider} from "@/context/QueuesContext";

export default function TournamentPage({params}: {params: {id: string}}) {
  return (
    <QueuesProvider>
      <div>
        <h1 className="text-center text-2xl font-bold">Tournament ID: {params.id}</h1>

        <QueuesPage />
      </div>
    </QueuesProvider>
  );
}
