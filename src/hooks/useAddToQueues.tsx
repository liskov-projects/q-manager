"use client";
// context
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
// types
import {TPlayer} from "@/types/Types";
import {TQueue} from "@/types/Types";

const useAddToQueues = () => {
  // NOTE: find out if it's needed here or we can use the parameters passed in the ButtonGroup.tsx
  const {currentTournament, setCurrentTournament} = useTournamentsAndQueuesContext();

  /**
   *WORKS: Find the shortest queue based on the number of items.
   */
  const findShortestQueue = (queues: TQueue[]): TQueue => {
    return queues.reduce((shortest, queue) =>
      queue.queueItems.length < shortest.queueItems.length ? queue : shortest
    );
  };

  /**
   *WORKS: Adds a specific item to the shortest queue.
   */
  const handleAddToShortestQueue = (itemId: string | undefined) => {
    const shortestQueue = findShortestQueue(currentTournament.queues);
    // copy the items
    const currentPlayers = [
      ...currentTournament.unProcessedQItems,
      ...currentTournament.processedQItems
    ];
    const itemToAdd = currentPlayers.find(player => player._id === itemId);
    if (!itemToAdd) {
      throw new Error("Item not found");
    }
    //copy the queues
    const updatedQueues = currentTournament.queues.map(queue =>
      queue._id === shortestQueue._id
        ? {...queue, queueItems: [...queue.queueItems, itemToAdd]}
        : queue
    );

    setCurrentTournament(prevTournament => {
      shortestQueue.queueItems.push(itemToAdd);
      return {
        ...prevTournament,
        queues: updatedQueues,
        unProcessedQItems: prevTournament?.unProcessedQItems.filter(
          player => player._id !== itemId
        ),
        processedQItems: prevTournament?.processedQItems.filter(
          player => player._id !== itemId
        )
      };
    });
  };

  /**
   *WORKS: Add all unassigned items to queues, starting with the shortest queue.
   */
  const handleAddAllToQueues = (players: TPlayer[]) => {
    // create on pool of players to add
    const unassignedPlayers = [
      //NOTE: do we want to use them all?
      ...players.unProcessedQItems,
      ...players.processedQItems
    ];
    // console.log("UnassignedPL", unassignedPlayers);

    const updatedQueues = [...currentTournament?.queues];
    unassignedPlayers.forEach(player => {
      const targetQeueue = findShortestQueue(updatedQueues);
      targetQeueue.queueItems.push(player);
    });

    setCurrentTournament(prev => ({
      ...prev,
      queues: updatedQueues,
      unProcessedQItems: [],
      processedQItems: []
    }));
  };

  /**
   *WORKS: Process all players, marking them as processed and clearing queues.
   */
  const handleProcessAll = () => {
    const poolOfPlayers = currentTournament?.queues
      .map(queue => queue.queueItems)
      .flat();
    // console.log(poolOfPlayers, "POOL");

    const clearedQueues = currentTournament.queues.map(queue => ({
      ...queue,
      queueItems: []
    }));

    setCurrentTournament(prev => ({
      ...prev,
      queues: clearedQueues,
      processedQItems: poolOfPlayers
    }));
  };

  /**
   *WORKS: Unprocess all players, resetting their queue state.
   */
  const handleUnprocessAll = () => {
    const poolOfPlayers = currentTournament?.queues
      .map(queue => queue.queueItems)
      .flat()
      .concat(currentTournament.processedQItems);
    // console.log(poolOfPlayers, "POOL");

    const clearedQueues = currentTournament.queues.map(queue => ({
      ...queue,
      queueItems: []
    }));

    setCurrentTournament(prev => ({
      ...prev,
      queues: clearedQueues,
      unProcessedQItems: poolOfPlayers,
      processedQItems: []
    }));
  };

  /**
   *WORKS: Process the next item in a specific queue.
   */
  const handleProgressOneStep = (queueIndex: number) => {
    const updatedQueues = [...currentTournament.queues];
    const processedPlayer = updatedQueues[queueIndex].queueItems.shift();

    if (!processedPlayer) return;

    setCurrentTournament(prevTournament => ({
      ...prevTournament,
      queues: updatedQueues,
      processedQItems: [...prevTournament.processedQItems, processedPlayer]
    }));
  };

  /**
   *WORKS: Redistribute all items evenly across all queues.
   */
  const handleRedistributeQueues = () => {
    const shortestQueueLength = findShortestQueue(currentTournament.queues).queueItems
      .length;

    const itemsToRedistribute: TPlayer[] = [];
    const balancedQueues = currentTournament.queues.map(queue => {
      const excessItems = queue.queueItems.slice(shortestQueueLength);
      itemsToRedistribute.push(...excessItems);
      return {
        ...queue,
        queueItems: queue.queueItems.slice(0, shortestQueueLength)
      };
    });

    itemsToRedistribute.forEach((item, index) => {
      const targetQueueIndex = index % balancedQueues.length;
      balancedQueues[targetQueueIndex].queueItems.push(item);
    });

    setCurrentTournament(prev => ({
      ...prev,
      queues: balancedQueues
    }));
  };

  return {
    handleAddToShortestQueue,
    handleAddAllToQueues,
    handleProcessAll,
    handleUnprocessAll,
    handleProgressOneStep,
    handleRedistributeQueues
  };
};

export default useAddToQueues;
