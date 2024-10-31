// types
import Player from "@/types/Player.js";
import QueueType from "@/types/Queue.js";
// context
import {useAppContext} from "@/Context/AppContext";

const useAddToQueues = () => {
  const {players, queues, setPlayers, setQueues, initialQueues} = useAppContext();

  // helper
  const findShortestQueue = (queues: QueueType[]) => {
    let shortestQueue = queues[0];
    queues.forEach(queue => {
      if (queue.queueItems.length < shortestQueue.queueItems.length) {
        shortestQueue = queue;
      }
    });
    return shortestQueue;
  };

  //helper
  function findAssignedToQueue(players: Player[]) {
    return players.filter(player => !player.assignedToQueue);
  }

  const handleAddToShortestQueue = (itemId: string) => {
    // Find the item based on itemId
    const itemToUpdate = players.find(player => player._id === itemId);

    if (!itemToUpdate) {
      throw new Error("Item not found");
    }

    const shortestQueue = findShortestQueue(queues);

    const updatedItem = {
      ...itemToUpdate,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    shortestQueue.queueItems.push(updatedItem);

    const newQueues = queues.map(queue => {
      if (queue.id == shortestQueue.id) {
        return shortestQueue;
      }
      return queue;
    });

    setPlayers(prevPlayers =>
      prevPlayers.map(player => (player._id === itemId ? updatedItem : player))
    );
    setQueues(newQueues);
  };

  const handleAddAllToQueues = (items: Player[]) => {
    for (const item of items) {
      if (!item.assignedToQueue) {
        item.assignedToQueue = true;
        item.processedThroughQueue = false;
        handleAddToShortestQueue(item._id);
      }
    }
  };

  // NEW:
  const handleProcessAll = (items: Player[]) => {
    const itemsToUpdate = items.map(item => {
      if (item.processedThroughQueue) return item;

      if (item.processedThroughQueue !== true) {
        return {
          ...item,
          processedThroughQueue: true,
          assignedToQueue: false
        };
      }
    });

    setPlayers(itemsToUpdate);
    setQueues(initialQueues);
  };

  // NEW:
  const handleUnprocessAll = (items: Player[]) => {
    const itemsToUpdate = items.map(item => {
      if (!item.assignedToQueue) return item;
      if (item.processedThroughQueue === true || item.assignedToQueue) {
        return {
          ...item,
          processedThroughQueue: false,
          assignedToQueue: false
        };
      }
    });

    setPlayers(itemsToUpdate);
    setQueues(initialQueues);
  };

  const handleProgressOneStep = (queueIndex: number) => {
    const newQueues = [...queues];
    const processedPlayer: Player | undefined =
      newQueues[queueIndex].queueItems.shift();

    if (!processedPlayer) console.log("no players to move");

    processedPlayer.processedThroughQueue = true;
    processedPlayer.assignedToQueue = false;

    const newPlayers = players.map(player => {
      if (player._id == processedPlayer._id) {
        return processedPlayer;
      }
      return player;
    });
    setPlayers(newPlayers);
    setQueues(newQueues);
  };

  const handleRedistributeQueues = (queues: QueueType[]) => {
    const shortestQueue = findShortestQueue(queues);

    const shortestQLength = shortestQueue.queueItems.length;

    const slicedQTailCollection = [];
    const stumps: string[] = [];

    for (let i = 0; i < queues.length; i++) {
      const slicedTail = queues[i].queueItems.slice(shortestQLength);
      slicedQTailCollection.push(slicedTail);
      stumps.push(queues[i].queueItems.slice(0, shortestQLength));
    }
    const tempQ: string[] = [];
    while (slicedQTailCollection.some(q => q.length > 0)) {
      slicedQTailCollection.forEach(tail => {
        if (tail.length > 0) {
          const itemToPush = tail.shift();
          tempQ.push(itemToPush);
        }
      });
    }

    tempQ.forEach((qItem, index) => {
      const stumpIndex = index % stumps.length;
      stumps[stumpIndex].push(qItem);
    });

    const newQueues: QueueType[] = queues.map((queue, index) => {
      return {...queue, queueItems: stumps[index]};
    });

    setQueues(newQueues);
  };

  return {
    handleAddToShortestQueue,
    handleAddAllToQueues,
    handleProgressOneStep,
    handleRedistributeQueues,
    findAssignedToQueue,
    handleProcessAll,
    handleUnprocessAll
  };
};

export default useAddToQueues;
