import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode
} from "react";
// types
import QueueType from "@/types/Queue";
import Player from "@/types/Player";
import AppContextType from "@/types/AppContextInterface";
import PlayerType from "@/types/Player";

// creating Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// context provider
export const AppProvider = ({children}: {children: ReactNode}) => {
  // Initial queue setup
  const initialQueues: QueueType[] = [
    {queueName: "1", queueItems: [], id: "0987"},
    {queueName: "2", queueItems: [], id: "1234"},
    {queueName: "3", queueItems: [], id: "5678"},
    {queueName: "4", queueItems: [], id: "4321"}
  ];
  const [queues, setQueues] = useState<QueueType[]>(initialQueues);
  const [players, setPlayers] = useState<Player[]>([]);
  const [draggedItem, setDraggedItem] = useState<Player | null>(null);

  const fetchPlayers = async () => {
    // the path to players route
    const response = await fetch("../api/players/");
    const players = await response.json();
    setPlayers(players);
  };

  // fetching from db is an effect
  useEffect(() => {
    fetchPlayers();
    // console.log(players);
  }, []);

  //NOTE: use for process all btn? mark player as processed | void because we're changin state with setState
  const markPlayerAsProcessed = (playerId: string) => {
    setPlayers(prev =>
      prev.map(player =>
        player._id === playerId ? {...player, processedThroughQueue: true} : player
      )
    );
  };

  // creates a list of unique categories for the filter
  const uniqueCategories = useMemo(() => {
    const categories = players.flatMap(player => player.categories || []);
    return Array.from(new Set(categories)); // Remove duplicates using Set
  }, [players]);
  // console.log(uniqueCategories);

  // updater function to consistently modify state
  const updatePlayers = (updatedPlayers: PlayerType[]) => setPlayers(updatedPlayers);
  const updateQueues = (updatedQueues: QueueType[]) => setQueues(updatedQueues);

  return (
    <AppContext.Provider
      value={{
        players,
        queues,
        setQueues,
        setPlayers,
        markPlayerAsProcessed,
        fetchPlayers,
        uniqueCategories,
        updatePlayers,
        updateQueues,
        draggedItem,
        setDraggedItem,
        // FIXME: dev purposes
        initialQueues
      }}>
      {children}
    </AppContext.Provider>
  );
};

// hook to use AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be within AppProvider");
  }
  return context;
};
