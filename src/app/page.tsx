"use client";
//NOTE: hooks
import {useState} from "react";
// types
import Player from "@/types/Player.js";
import QueueType from "@/types/Queue.js";
// components
import Button from "@/Components/Button";
import SectionHeader from "@/Components/SectionHeader";
import PlayersList from "@/Components/PlayersList";
import QueuesGrid from "@/Components/Queue/QueuesGrid";
import ProcessedPlayers from "@/Components/ProcessedPlayers";
//mock data
import players from "../data/players.js";

// Initial queue setup
const initialQueues: QueueType[] = [
  {queueName: "1", queueItems: [], id: "0987"},
  {queueName: "2", queueItems: [], id: "1234"},
  {queueName: "3", queueItems: [], id: "5678"},
  {queueName: "4", queueItems: [], id: "4321"}
];

// Initialize players with assignedToQueue property
const playersUpdated: Player[] = players.map(player => {
  player.assignedToQueue = false;
  player.processedThroughQueue = false;
  return player;
});

const App = () => {
  const [queues, setQueues] = useState<QueueType[]>(initialQueues);
  const [players, setPlayers] = useState<Player[]>(playersUpdated);

  // TODO: make into a hook
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

  // TODO: make into a hook
  function handleAddAllToQueues(items: Player[]) {
    for (const item of items) {
      if (!item.assignedToQueue) {
        item.assignedToQueue = true;
        handleAddToShortestQueue(item.id);
      }
    }
  }

  // TODO: helper
  const findShortestQueue = (queues: QueueType[]) => {
    let shortestQueue = queues[0];
    queues.forEach(queue => {
      if (queue.queueItems.length < shortestQueue.queueItems.length) {
        shortestQueue = queue;
      }
    });
    return shortestQueue;
  };

  // TODO: make into a hook
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

  // TODO: make into a hook
  function handleRedistributeQueues(queues) {
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
  }
  // TODO: helper
  function findAssignedToQueue(players) {
    return players.filter(player => !player.assignedToQueue);
  }

  return (
    <div className="flex flex-col bg-red-300">
      <h1 className="text-2xl font-bold text-gray-700 self-center">
        Queue Management
      </h1>

      <div className="p-8 bg-green-200">
        <SectionHeader>Unprocessed Players</SectionHeader>

        <PlayersList
          players={players}
          addItemToShortestQueue={handleAddToShortestQueue}
        />
      </div>

      <div className="flex flex-row justify-around">
        <Button
          className="bg-gray-300 text-black py-2 h-[45px] w-[250px] px-4 rounded"
          onClick={() => {
            //TODO: extract the argument to make it shorter here
            handleAddAllToQueues(findAssignedToQueue(players));
          }}>
          Add All Players to Queues
        </Button>
        <Button
          className="bg-blue-500 text-black py-2 h-[45px] w-[250px] px-4 rounded"
          onClick={() => {
            handleRedistributeQueues(queues);
          }}>
          Redestribute Players
        </Button>
      </div>

      <div className=" p-8 bg-blue-100">
        <SectionHeader>Queues</SectionHeader>

        <QueuesGrid
          queues={queues}
          setQueues={setQueues}
          //REVIEW: the player state & its setter aren't used in QueuesGrid
          players={players}
          setPlayers={setPlayers}
          onProgress={handleProgressOneStep}
        />
      </div>

      <div className="p-8 bg-yellow-200">
        <SectionHeader>Processed Players</SectionHeader>

        <ProcessedPlayers
          players={players}
          addItemToShortestQueue={handleAddToShortestQueue}
        />
      </div>
    </div>
  );
};

export default App;
