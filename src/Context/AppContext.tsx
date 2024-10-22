import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
  // fetching from db is an effect
  useEffect(() => {
    const fetchPlayers = async () => {
      // the path to players route
      const response = await fetch("../api/players/");
      const players = await response.json();
      setPlayers(players);
    };

    fetchPlayers();
    console.log(players);
  }, []);

  //NOTE: use for process all btn? mark player as processed | void because we're changin state with setState
  const markPlayerAsProcessed = (playerId: string) => {
    setPlayers(prev =>
      prev.map(player =>
        player._id === playerId ? {...player, processedThroughQueue: true} : player
      )
    );
  };

  //   NEW: D N D    x p e r i m e n t
  const handleDragStart = (draggedItem: Player) => setDraggedItem(draggedItem);
  // type for the event object
  const handleDragOver = (e: React.MouseEvent<HTMLLIElement>): void =>
    e.preventDefault();

  const dragNdropInQueues = (draggedItem: Player, targetItem: Player) => {
    // OLD: works for items ALREADY in the queue
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
  //     const draggedItemIndex = players.findIndex(item => item._id === draggedItem._id);
  //     const targetItemIndex = players.findIndex(item => item._id === targetItem._id);

  //     // make a copy
  //     const updatedPlayers = [...players];

  //     // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
  //     updatedPlayers.splice(draggedItemIndex, 1);

  //     // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
  //     updatedPlayers.splice(targetItemIndex, 0, draggedItem);

  //     setPlayers(updatedPlayers);
  //   };

  //OLD: does the main dragndrop
  const handleDrop = (
    event: React.DragEvent<HTMLUListElement>,
    targetItem: Player,
    queue: QueueType
  ) => {

    event.preventDefault();

    console.log("DRAGGED ITEM")
    console.log(targetItem);

    if (!draggedItem) return;

    // console.log(e);
    console.log("THE QUEUE");
    console.log(queue);


    console.log("EVENT .dataTransfer.items")
    console.log(event.dataTransfer.items)

    console.log("DROP TARGET")
    console.dir(event.target)

    console.log("DROP TARGET DATA")
    console.log(event.currentTarget.className)

    // globally look for what we drag & drop
    // const draggedObject = players.find(player => player._id === draggedItem._id);
    // const droppedOnObject = players.find(player => player._id === targetItem._id);

    // if (!droppedOnObject) {
    //   console.error("Item not found");
    //   return;
    // }

    // console.log("this is WHAT we drop ", draggedObject);
    // console.log("this is WHERE we drop ", droppedOnObject);
    // check where items is going to
    // if (
    //   // into PROCESSED
    //   droppedOnObject.processedThroughQueue
    // ) {
    //   //   dragNdropPlayers(draggedItem, targetItem);
    //   setPlayers(prevPlayers =>
    //     prevPlayers.map(p =>
    //       p.id === draggedObject?.id ? {...p, processedThroughQueue: true} : p
    //     )
    //   );
    // } else if (
    //   // into UPROCESSED
    //   !droppedOnObject.assignedToQueue &&
    //   !droppedOnObject.processedThroughQueue
    // ) {
    //   setPlayers(prevPlayers =>
    //     prevPlayers.map(p =>
    //       p.id === draggedItem.id
    //         ? {...p, assignedToQueue: false, processedThroughQueue: false}
    //         : p
    //     )
    //   );
    // } else if (
    //   // into the QUEUES
    //   droppedOnObject.assignedToQueue
    // ) {
    //   // works for items already in the queues
    //   dragNdropInQueues(draggedItem, targetItem);
    // }
    // setDraggedItem(null);
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
