"use client";
// context
import {AppProvider} from "@/Context/AppContext";
// components
import SectionHeader from "@/Components/SectionHeader";
import PlayersList from "@/Components/PlayersList";
import QueuesGrid from "@/Components/Queue/QueuesGrid";
import ProcessedPlayers from "@/Components/ProcessedPlayers";
import ButtonGroup from "@/Components/ButtonGroup";

const App = () => {
  return (
    <AppProvider>
      <div className="flex flex-col bg-red-300">
        <h1 className="text-2xl font-bold text-gray-700 self-center">
          Queue Management
        </h1>

        <div className="p-8 bg-green-200">
          <SectionHeader>Unprocessed Players</SectionHeader>

          <PlayersList />
        </div>

        <ButtonGroup />
        <div className=" p-8 bg-blue-100">
          <SectionHeader>Queues</SectionHeader>

          <QueuesGrid />
        </div>

        <div className="p-8 bg-yellow-200">
          <SectionHeader>Processed Players</SectionHeader>

          <ProcessedPlayers />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
