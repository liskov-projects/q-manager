"use client";

import {TournamentProvider} from "@/context/TournamentContext";
import AllTournaments from "./all-tournaments/page";
import {QueuesProvider} from "@/context/QueuesContext";

const App = () => {
  return (
      <AllTournaments />
  );
};

export default App;
