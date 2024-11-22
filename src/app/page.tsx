"use client";

import {TournamentProvider} from "@/context/TournamentContext";
import AllTournaments from "./all-tournaments/page";
import {QueuesProvider} from "@/context/QueuesContext";

const App = () => {
  return (
<<<<<<< HEAD
    <TournamentProvider>
      <QueuesProvider>
        <AllTournaments />
      </QueuesProvider>
    </TournamentProvider>
=======
      <AllTournaments />
>>>>>>> 65b7535 (Pushing provider to top level)
  );
};

export default App;
