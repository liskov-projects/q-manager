"use client";

import QueuesPage from "@/components/Pages/QueuesPage";
import {QueuesProvider} from "@/context/AppContext";

export default function TournamentPage({params}: {params: {id: string}}) {
  return (
    // Placing it here as we will limit functionality later on | maybe do a lego from separate components instead of a page?
    // <QueuesProvider>
    //   <div>
    //     <h1 className="text-center text-2xl font-bold">Tournament ID: {params.id}</h1>

    //     <QueuesPage />
    //   </div>
    // </QueuesProvider>
  );
}
