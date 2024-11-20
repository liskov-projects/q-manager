"use client";

import {TournamentProvider} from "@/context/TournamentContext";
import AllTournaments from "./all-tournaments/page";
import {QueuesProvider} from "@/context/QueuesContext";

const App = () => {
  return (
    <QueuesProvider>
      <TournamentProvider>
        <AllTournaments />
      </TournamentProvider>
    </QueuesProvider>
  );
};

export default App;
