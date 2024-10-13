// types
import Player from "@/types/Player.js";
import QueueType from "@/types/Queue.js";

const useAddToQueues = (queues, setQueues, players, setPlayers) => {
  const handleAddToShortestQueue = async (itemId: string) => {
    // Find the item based on itemId
    const itemToUpdate = players.find(player => player.id === itemId);

    if (!itemToUpdate) {
      throw new Error("Item not found");
    }

    const shortestQueue = findShortestQueue(queues);

    const updatedItem = {
      ...itemToUpdate,
      assignedToQueue: true
    };

    shortestQueue.queueItems.push(updatedItem);

    const newQueues = queues.map(queue => {
      if (queue.id == shortestQueue.id) {
        return shortestQueue;
      }
      return queue;
    });

    setPlayers(prevPlayers =>
      prevPlayers.map(player => (player.id === itemId ? updatedItem : player))
    );
    setQueues(newQueues);
  };

  const handleAddAllToQueues = (items: Player[]) => {
    for (const item of items) {
      if (!item.assignedToQueue) {
        item.assignedToQueue = true;
        handleAddToShortestQueue(item.id);
      }
    }
  };

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

  const handleProgressOneStep = (queueIndex: number) => {
    const newQueues = [...queues];
    const processedPlayer: Player | undefined =
      newQueues[queueIndex].queueItems.shift();

    processedPlayer.processedThroughQueue = true;
    processedPlayer.assignedToQueue = false;

    const newPlayers = players.map(player => {
      if (player.id == processedPlayer.id) {
        return processedPlayer;
      }
      return player;
    });
    setPlayers(newPlayers);
    setQueues(newQueues);
  };

  const handleRedistributeQueues = queues => {
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

    const newQueues = queues.map((queue, index) => {
      return {...queue, queueItems: stumps[index]};
    });

    setQueues(newQueues);
  };

  return {
    handleAddToShortestQueue,
    handleAddAllToQueues,
    handleProgressOneStep,
    handleRedistributeQueues
  };
};

export default useAddToQueues;
