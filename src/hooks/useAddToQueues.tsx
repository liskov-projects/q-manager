// IMPORTANT: fully functional, but now we use the socket
"use client";
// context
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TPlayer, TTournament } from "@/types/Types";
import { TQueue } from "@/types/Types";
import { useSocket } from "@/context/SocketContext";

const useAddToQueues = () => {
  const { currentTournament, setCurrentTournament, currentTournamentRef } =
    useTournamentsAndQueuesContext();
  const { socket } = useSocket();

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
  const handleAddToShortestQueue = (playerData: TPlayer | undefined) => {
    console.log("runnning handleAddToShortestQ");
    console.log("playersData", playerData);
    console.log(currentTournamentRef.current?.queues);
    const shortestQueue = findShortestQueue(currentTournamentRef.current?.queues);
    // copy the items
    const currentPlayers = [
      ...currentTournamentRef.current?.unProcessedQItems,
      ...currentTournamentRef.current?.processedQItems,
    ];
    const itemToAdd = currentPlayers.find((player: TPlayer) => player._id === playerData._id);
    if (!itemToAdd) {
      throw new Error("Item not found");
    }
    //copy the queues
    const updatedQueues = currentTournamentRef.current?.queues.map((queue: TQueue) =>
      queue._id === shortestQueue._id
        ? { ...queue, queueItems: [...queue.queueItems, itemToAdd] }
        : queue
    );

    setCurrentTournament((prevTournament: TTournament) => {
      shortestQueue.queueItems.push(itemToAdd);
      return {
        ...prevTournament,
        queues: updatedQueues,
        unProcessedQItems: prevTournament?.unProcessedQItems.filter(
          (player: TPlayer) => player._id !== playerData._id
        ),
        processedQItems: prevTournament?.processedQItems.filter(
          (player: TPlayer) => player._id !== playerData._id
        ),
      };
    });
  };

  /**
   *WORKS: Add all unassigned items to queues, starting with the shortest queue.
   */
  const handleAddAllToQueues = (players: TTournament) => {
    // create on pool of players to add
    const unassignedPlayers = [
      //NOTE: do we want to use them all?
      ...players.unProcessedQItems,
      ...players.processedQItems,
    ];
    // console.log("UnassignedPL", unassignedPlayers);

    const updatedQueues = [...currentTournamentRef?.queues];
    unassignedPlayers.forEach((player) => {
      const targetQeueue = findShortestQueue(updatedQueues);
      targetQeueue.queueItems.push(player);
    });

    setCurrentTournament((prev: TTournament) => ({
      ...prev,
      queues: updatedQueues,
      unProcessedQItems: [],
      processedQItems: [],
    }));
  };

  /**
   *WORKS: Process all players, marking them as processed and clearing queues.
   */
  const handleProcessAll = () => {
    const poolOfPlayers = currentTournament?.queues.map((queue: TQueue) => queue.queueItems).flat();
    // console.log(poolOfPlayers, "POOL");

    const clearedQueues = currentTournament.queues.map((queue: TQueue) => ({
      ...queue,
      queueItems: [],
    }));

    setCurrentTournament((prev: TTournament) => ({
      ...prev,
      queues: clearedQueues,
      processedQItems: poolOfPlayers,
    }));
  };

  /**
   *WORKS: Unprocess all players, resetting their queue state.
   */
  const handleUnprocessAll = () => {
    const poolOfPlayers = currentTournament?.queues
      .map((queue: TQueue) => queue.queueItems)
      .flat()
      .concat(currentTournament.processedQItems);
    // console.log(poolOfPlayers, "POOL");

    const clearedQueues = currentTournament.queues.map((queue: TQueue) => ({
      ...queue,
      queueItems: [],
    }));

    setCurrentTournament((prev: TTournament) => ({
      ...prev,
      queues: clearedQueues,
      unProcessedQItems: poolOfPlayers,
      processedQItems: [],
    }));
  };

  /**
   *WORKS: Process the next item in a specific queue.
   */
  const handleProgressOneStep = (queueIndex: number) => {
    const updatedQueues = [...currentTournament.queues];
    const processedPlayer = updatedQueues[queueIndex].queueItems.shift();

    if (!processedPlayer) return;

    setCurrentTournament((prevTournament: TTournament) => ({
      ...prevTournament,
      queues: updatedQueues,
      processedQItems: [...prevTournament.processedQItems, processedPlayer],
    }));
  };

  /**
   *WORKS: Redistribute all items evenly across all queues.
   */
  const handleRedistributeQueues = () => {
    const shortestQueueLength = findShortestQueue(currentTournament.queues).queueItems.length;

    const itemsToRedistribute: TPlayer[] = [];
    const balancedQueues = currentTournament.queues.map((queue: TQueue) => {
      const excessItems = queue.queueItems.slice(shortestQueueLength);
      itemsToRedistribute.push(...excessItems);
      return {
        ...queue,
        queueItems: queue.queueItems.slice(0, shortestQueueLength),
      };
    });

    itemsToRedistribute.forEach((item, index) => {
      const targetQueueIndex = index % balancedQueues.length;
      balancedQueues[targetQueueIndex].queueItems.push(item);
    });

    // setCurrentTournament((prev: TTournament) => ({
    //   ...prev,
    //   queues: balancedQueues,
    // }));
    socket.emit("redistributePlayers", {
      tournamentId: currentTournament._id, // send the tournament id to identify which tournament to update
      balancedQueues: balancedQueues,
    });
  };

  return {
    handleAddToShortestQueue,
    handleAddAllToQueues,
    handleProcessAll,
    handleUnprocessAll,
    handleProgressOneStep,
    handleRedistributeQueues,
  };
};

export default useAddToQueues;
