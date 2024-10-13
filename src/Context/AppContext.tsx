import React, {createContext, useContext, useState, ReactNode} from "react";
// types
import QueueType from "@/types/Queue";
import Player from "@/types/Player";
// mock data
import players from "../Data/players.js";

// context type
interface AppContextType {
  players: Player[];
  queues: QueueType[];
  setQueues: React.Dispatch<React.SetStateAction<QueueType[]>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  // should return QueueTyep[]?
  markPlayerAsProcessed: (playerId: string) => QueueType[];
}

// creating Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial queue setup
const initialQueues: QueueType[] = [
  {queueName: "1", queueItems: [], id: "0987"},
  {queueName: "2", queueItems: [], id: "1234"},
  {queueName: "3", queueItems: [], id: "5678"},
  {queueName: "4", queueItems: [], id: "4321"}
];

// Initialize players with assignedToQueue property
const playersUpdated: Player[] = players.map(player => ({
  ...player,
  assignedToQueue: false,
  processedThroughQueue: false
}));

// context provider
export const AppProvider = ({children}: {children: ReactNode}) => {
  const [queues, setQueues] = useState<QueueType[]>(initialQueues);
  const [players, setPlayers] = useState<Player[]>(playersUpdated);

  // mark player as processed
  const markPlayerAsProcessed = (playerId: string) => {
    setPlayers((prev: QueueType[]) => {
      prev.map(p => (p.id === playerId ? {...p, processedThroughQueue: true} : p));
    });
  };

  return (
    <AppContext.Provider
      value={{
        players,
        queues,
        setQueues,
        setPlayers,
        markPlayerAsProcessed
      }}>
      {children}
    </AppContext.Provider>
  );
};

// hook to use AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContect must be within AppProvider");
  }
  return context;
};
