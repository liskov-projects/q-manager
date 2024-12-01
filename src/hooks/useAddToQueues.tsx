"use client";

// Types
import {TPlayer} from "@/types/Types";
import {TQueue} from "@/types/Types";
// Context
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";

const useAddToQueues = () => {
  const {
    currentTournamentPlayers,
    setCurrentTournamentPlayers,
    currentTournament,
    setCurrentTournament,
    setPlayers,
    setQueues
  } = useTournamentsAndQueuesContext();

  /**
   * Find the shortest queue based on the number of items.
   */
  const findShortestQueue = (queues: TQueue[]): TQueue => {
    return currentTournament.queues.reduce((shortest, queue) =>
      queue.queueItems.length < shortest.queueItems.length ? queue : shortest
    );
  };

  /**
   * Find players not yet assigned to a queue.
   */
  const findAssignedToQueue = (players: TPlayer[]): TPlayer[] => {
    return players.filter(player => !player.assignedToQueue);
  };

  /**
   * Add a specific item to the shortest queue.
   */
  const handleAddToShortestQueue = (itemId: string | undefined) => {
    const itemToUpdate = currentTournamentPlayers.find(
      player => player._id == itemId
    );

    // console.log(itemToUpdate);
    if (!itemToUpdate) {
      throw new Error("Item not found");
    }

    const shortestQueue = findShortestQueue(currentTournament.queues);
    console.log(shortestQueue);
    const updatedItem = {
      ...itemToUpdate,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    const updatedQueues = currentTournament.queues.map(queue =>
      queue.id === shortestQueue.id
        ? {...queue, queueItems: [...queue.queueItems, updatedItem]}
        : queue
    );

    setCurrentTournamentPlayers(prevPlayers =>
      prevPlayers.map(player => (player._id === itemId ? updatedItem : player))
    );

    setCurrentTournament(prevTournament => ({
      ...prevTournament,
      queues: updatedQueues
    }));
  };

  /**
   * Add all unassigned items to queues, starting with the shortest queue.
   */
  const handleAddAllToQueues = (items: TPlayer[]) => {
    items
      .filter(item => !item.assignedToQueue)
      .forEach(item => {
        handleAddToShortestQueue(item._id);
      });
  };

  /**
   * Process all players, marking them as processed and clearing queues.
   */
  const handleProcessAll = (items: TPlayer[]) => {
    const updatedPlayers = items.map(item => ({
      ...item,
      processedThroughQueue: true,
      assignedToQueue: false
    }));

    const clearedQueues = queues.map(queue => ({
      ...queue,
      queueItems: []
    }));

    setPlayers(updatedPlayers);
    setQueues(clearedQueues);
  };

  /**
   * Unprocess all players, resetting their queue state.
   */
  const handleUnprocessAll = (items: TPlayer[]) => {
    const updatedPlayers = items.map(item => ({
      ...item,
      processedThroughQueue: false,
      assignedToQueue: false
    }));

    const clearedQueues = queues.map(queue => ({
      ...queue,
      queueItems: []
    }));

    setPlayers(updatedPlayers);
    setQueues(clearedQueues);
  };

  /**
   * Process the next item in a specific queue.
   */
  const handleProgressOneStep = (queueIndex: number) => {
    const updatedQueues = [...currentTournament.queues];
    const processedPlayer = updatedQueues[queueIndex].queueItems.shift();

    if (!processedPlayer) return;

    const updatedPlayer = {
      ...processedPlayer,
      processedThroughQueue: true,
      assignedToQueue: false
    };

    const updatedPlayers = currentTournamentPlayers.map(player =>
      player._id === updatedPlayer._id ? updatedPlayer : player
    );

    setCurrentTournamentPlayers(updatedPlayers);
    setCurrentTournament(prevTournament => ({
      ...prevTournament,
      queues: updatedQueues
    }));
  };

  /**
   * Redistribute all items evenly across all queues.
   */
  const handleRedistributeQueues = () => {
    const shortestQueueLength = findShortestQueue(queues).queueItems.length;

    const itemsToRedistribute: TPlayer[] = [];
    const balancedQueues = queues.map(queue => {
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

    setQueues(balancedQueues);
  };

  return {
    handleAddToShortestQueue,
    handleAddAllToQueues,
    handleProcessAll,
    handleUnprocessAll,
    handleProgressOneStep,
    handleRedistributeQueues,
    findAssignedToQueue
  };
};

export default useAddToQueues;
