"use client";
// context
import {AppProvider} from "@/Context/AppContext";
// components
import SectionHeader from "@/Components/SectionHeader";
import PlayersList from "@/Components/PlayersList";
import QueuesGrid from "@/Components/Queue/QueuesGrid";
import ProcessedPlayers from "@/Components/ProcessedPlayers";
import ButtonGroup from "@/Components/ButtonGroup";
// NEW:
import Players from "@/Components/Players";
const App = () => {
  return (
    <AppProvider>
      <div className="flex justify-center py-8">
        <h1 className="text-2xl font-bold text-gray-700 ">Queue Management</h1>
      </div>
      <div className="flex flex-row bg-red-300 justify-around">
        <div className="p-8 w-1/5 bg-green-200">
          <SectionHeader>Unprocessed Players</SectionHeader>

          <PlayersList />
          {/* FIXME: trying to make one component for both players groups
          to do drag n drop */}
          {/* <Players /> */}
        </div>

        <div className=" p-8 bg-blue-100">
          <SectionHeader>Queues</SectionHeader>
          <ButtonGroup />

          <QueuesGrid />
        </div>

        <div className="p-8 w-1/5 bg-yellow-200">
          <SectionHeader>Processed Players</SectionHeader>

          <ProcessedPlayers />
          {/* FIXME: trying to make one component for both players groups
          to do drag n drop */}
          {/* <Players /> */}
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
