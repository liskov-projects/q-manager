import React, {createContext, useContext, useState, ReactNode} from "react";
// types
import QueueType from "@/types/Queue";
import Player from "@/types/Player";
import AppContextType from "@/types/AppContextInterface";
// mock data
import players from "../Data/players.js";

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
        player.id === playerId ? {...player, processedThroughQueue: true} : player
      )
    );
  };

  //   NEW: D N D    x p e r i m e n t
  const handleDragStart = (draggedItem: Player) => setDraggedItem(draggedItem);
  // type for the event object
  const handleDragOver = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  const dragNdropInQueues = (draggedItem, targetItem) => {
    // OLD: works for items ALREADY in the queue
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
  };

  //   NEW:
  //   const dragNdropPlayers = (draggedItem, targetItem) => {
  //     // Find the indexes of the dragged and target items in the Players []
  //     const draggedItemIndex = players.findIndex(item => item.id === draggedItem.id);
  //     const targetItemIndex = players.findIndex(item => item.id === targetItem.id);

  //     // make a copy
  //     const updatedPlayers = [...players];

  //     // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
  //     updatedPlayers.splice(draggedItemIndex, 1);

  //     // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
  //     updatedPlayers.splice(targetItemIndex, 0, draggedItem);

  //     setPlayers(updatedPlayers);
  //   };

  //OLD: does the main dragndrop
  const handleDrop = (e: React.MouseEvent<HTMLButtonElement>, targetItem: Player) => {
    e.preventDefault();
    console.log(targetItem);
    if (!draggedItem) return;

    // console.log(e);
    // console.log(players);

    // globally look for what we drag & drop
    const draggedObject = players.find(player => player.id === draggedItem.id);
    const droppedOnObject = players.find(player => player.id === targetItem.id);

    console.log("this is WHAT we drop ", draggedObject);
    console.log("this is WHERE we drop ", droppedOnObject);
    // check where items is going to
    if (
      // into PROCESSED
      droppedOnObject.processedThroughQueue
    ) {
      //   dragNdropPlayers(draggedItem, targetItem);
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === draggedObject.id ? {...p, processedThroughQueue: true} : p
        )
      );
    } else if (
      // into UPROCESSED
      !droppedOnObject.assignedToQueue &&
      !droppedOnObject.processedThroughQueue
    ) {
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === draggedItem.id
            ? {...p, assignedToQueue: false, processedThroughQueue: false}
            : p
        )
      );
    } else if (
      // into the QUEUES
      droppedOnObject.assignedToQueue
    ) {
      // works for items already in the queues
      dragNdropInQueues(draggedItem, targetItem);
    }
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
