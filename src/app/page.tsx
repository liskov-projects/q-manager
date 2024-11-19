"use client";

import AllTournaments from "./all-tournaments/page";
import {QueuesProvider} from "@/context/QueuesContext";

const App = () => {
  return (
    <QueuesProvider>
      <AllTournaments />
    </QueuesProvider>
  );
};

export default App;
