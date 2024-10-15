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
  const [draggedItem, setDraggedItem] = useState<Player | null>(null);

  // mark player as processed
  const markPlayerAsProcessed = (playerId: string) => {
    setPlayers((prev: Player[]) =>
      prev.map(player =>
        player.id === playerId
          ? { ...player, processedThroughQueue: true }
          : player
      )
    );
  };


  //   NEW: D N D    x p e r i m e n t

  const handleDragStart = (draggedItem: Player) => setDraggedItem(draggedItem);
  // type for the event object
  const handleDragOver = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  // does the main dragndrop
  const handleDrop = (e: React.MouseEvent<HTMLButtonElement>, targetItem: Player) => {
    e.preventDefault();

    if (!draggedItem) return;

    // Find the queues containing dragged and target items
    const draggedQueueIndex = queues.findIndex(q =>
      q.queueItems.some(item => item.id === draggedItem.id)
    );
    const targetQueueIndex = queues.findIndex(q =>
      q.queueItems.some(item => item.id === targetItem.id)
    );

    // check if the indexes are found
    if (draggedQueueIndex === -1 || targetQueueIndex === -1) return;

    // Find the indexes of the dragged and target items in queues
    const draggedItemIndex = queues[draggedQueueIndex].queueItems.findIndex(
      item => item.id === draggedItem.id
    );
    const targetItemIndex = queues[targetQueueIndex].queueItems.findIndex(
      item => item.id === targetItem.id
    );

    // Copy the queues
    const updatedDraggedQueueItems = [...queues[draggedQueueIndex].queueItems];
    const updatedTargetQueueItems = [...queues[targetQueueIndex].queueItems];

    // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
    updatedDraggedQueueItems.splice(draggedItemIndex, 1);

    // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
    updatedTargetQueueItems.splice(targetItemIndex, 0, draggedItem);

    // Update the state with modified items
    setQueues((prevQueues: QueueType[]) => {
      return prevQueues.map((q, index) => {
        if (index === draggedQueueIndex) {
          return {...q, queueItems: updatedDraggedQueueItems};
        }
        if (index === targetQueueIndex) {
          return {...q, queueItems: updatedTargetQueueItems};
        }
        return q;
      });
    });

    setDraggedItem(null);
  };

  return (
    <AppContext.Provider
      value={{
        players,
        queues,
        setQueues,
        setPlayers,
        markPlayerAsProcessed,
        handleDragStart,
        handleDragOver,
        handleDrop
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
