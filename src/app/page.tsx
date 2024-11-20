"use client";

import {TournamentProvider} from "@/context/TournamentContext";
import AllTournaments from "./all-tournaments/page";
import {QueuesProvider} from "@/context/QueuesContext";

const App = () => {
  return (
    <TournamentProvider>
      <QueuesProvider>
        <AllTournaments />
      </QueuesProvider>
    </TournamentProvider>
  );
};

export default App;
