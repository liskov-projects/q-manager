"use client";
// context
import {AppProvider} from "@/Context/AppContext";
import {useAppContext} from "@/Context/AppContext";
// hooks
import {useState} from "react";
import useAddToQueues from "@/Hooks/useAddToQueues.jsx";
// types
import Player from "@/types/Player.js";
import QueueType from "@/types/Queue.js";
// components
import SectionHeader from "@/Components/SectionHeader";
import PlayersList from "@/Components/PlayersList";
import QueuesGrid from "@/Components/Queue/QueuesGrid";
import ProcessedPlayers from "@/Components/ProcessedPlayers";
import ButtonGroup from "@/Components/ButtonGroup";
// // //mock data
// import players from "../Data/players.js";

// // Initial queue setup
// const initialQueues: QueueType[] = [
//   {queueName: "1", queueItems: [], id: "0987"},
//   {queueName: "2", queueItems: [], id: "1234"},
//   {queueName: "3", queueItems: [], id: "5678"},
//   {queueName: "4", queueItems: [], id: "4321"}
// ];

// // Initialize players with assignedToQueue property
// const playersUpdated: Player[] = players.map(player => {
//   player.assignedToQueue = false;
//   player.processedThroughQueue = false;
//   return player;
// });

const App = () => {
  // const [queues, setQueues] = useState<QueueType[]>(initialQueues);
  // const [players, setPlayers] = useState<Player[]>(playersUpdated);

  // const {handleAddAllToQueues, handleRedistributeQueues} = useAddToQueues();

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
