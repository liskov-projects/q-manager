"use client";

import {QueuesProvider} from "@/context/AppContext";
import QueuesPage from "@/components/Pages/QueuesPage";

const App = () => {
  return (
    <QueuesProvider>
      <QueuesPage />
    </QueuesProvider>
  );
};

export default App;
