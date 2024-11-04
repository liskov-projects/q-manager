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

  // D N D    x p e r i m e n t
  const handleDragStart = (draggedItem: Player) => setDraggedItem(draggedItem);
  // type for the event object
  const handleDragOver = (e: React.MouseEvent<HTMLLIElement>): void =>
    e.preventDefault();

  const dragNdropInQueues = (draggedItem: Player, targetItem: Player) => {
    console.log("dragNdropInQueues enters ");
    // Find the queues containing dragged and target items
    const draggedQueueIndex = queues.findIndex(q =>
      q.queueItems.some(item => item._id === draggedItem._id)
    );
    const targetQueueIndex = queues.findIndex(q =>
      q.queueItems.some(item => item._id === targetItem._id)
    );

    // check if the indexes are found
    if (draggedQueueIndex === -1 || targetQueueIndex === -1) return;

    // Find the indexes of the dragged and target items in queues
    const draggedItemIndex = queues[draggedQueueIndex].queueItems.findIndex(
      item => item._id === draggedItem._id
    );
    const targetItemIndex = queues[targetQueueIndex].queueItems.findIndex(
      item => item._id === targetItem._id
    );

    // Copy the queues
    const updatedDraggedQueueItems = [...queues[draggedQueueIndex].queueItems];
    const updatedTargetQueueItems = [...queues[targetQueueIndex].queueItems];

    // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
    updatedDraggedQueueItems.splice(draggedItemIndex, 1);
    console.log("Dragging from", updatedDraggedQueueItems);
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

  //
  //   const dragNdropPlayers = (draggedItem, targetItem) => {
  //     // Find the indexes of the dragged and target items in the Players []
  //     const draggedItemIndex = players.findIndex(item => item._id === draggedItem._id);
  //     const targetItemIndex = players.findIndex(item => item._id === targetItem._id);

  //     // make a copy
  //     const updatedPlayers = [...players];

  //     // removes the dragged item (draggedItem - what to move, 1 - items to remove)
  //     updatedPlayers.splice(draggedItemIndex, 1);

  //     // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
  //     updatedPlayers.splice(targetItemIndex, 0, draggedItem);

  //     setPlayers(updatedPlayers);
  //   };

  // main dNd function

  // NEW:
  function identifyQueues(queues, draggedItem) {
    // if dragged item assigned to a queue: true
    if (draggedItem.assignedToQueue) {
      const sourceQueue = queues.find(queue =>
        queue.queueItems.some(item => item._id === draggedItem._id)
      );
      // console.log("source queue name: ", sourceQueue);
      return sourceQueue.queueName;
    } else {
      console.log("no queues");
    }
  }

  const handleDrop = (index: number = 0, queueTarget: QueueType, queues) => {
    console.log("IN THE CONTEXT DROP");

    // console.log("DRAGGED ITEM");
    // console.log(draggedItem);
    console.log("index: ", index);
    if (!draggedItem) return;
    // NEW:
    const sourceQueueName = identifyQueues(queues, draggedItem);
    // TODO: need a guard somewhere to redirect the flow

    // create a copy of the dragged item to correctly change the property
    const updatedItem = {
      ...draggedItem,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    const updatedPlayers = players.map(player => {
      if (player._id === draggedItem._id) {
        return updatedItem;
        // return {...player, assignedToQueue: true};
      }
      return player;
    });

    const updatedQueues = queues.map(queue => {
      if (queue.id === queueTarget.id) {
        // Create a new array with the draggedItem inserted at the specified index
        const newQueueItems = [
          ...queue.queueItems.slice(0, index + 1),
          updatedItem,
          ...queue.queueItems.slice(index + 1)
        ];
        // Return a new queue object with the updated queueItems
        return {
          ...queue,
          queueItems: newQueueItems
        };
      } else if (queue.queueName === sourceQueueName) {
        return {
          ...queue,
          queueItems: queue.queueItems.filter(item => item._id !== draggedItem._id)
        };
      }
      return queue;
    });
    // Update the players state
    setPlayers(updatedPlayers);
    // update the queues state
    setQueues(updatedQueues);
    // }

    // console.log(e);
    // console.log("THE QUEUE");
    // console.log(queueTarget);

    //this is queue index
    // console.log("INDEX");
    // console.log(index);

    setDraggedItem(null);
    // console.log("DRAGGED ITEM");
    // console.log(updatedItem);
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
        handleDrop,
        draggedItem,
        fetchPlayers,
        // FIXME: dev purposes
        initialQueues,
        uniqueCategories
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
