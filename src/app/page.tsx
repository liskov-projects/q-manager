"use client";
//NOTE: hooks
import {useState} from "react";
// types
import Player from "@/types/Player.js";
import QueueType from "@/types/Queue.js";
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
const playersUpdated = players.map(player => {
  player.assignedToQueue = false;
  player.processedThroughQueue = false;
  player.currentMatch = false;
  return player;
});

const App = () => {
  const [queues, setQueues] = useState<QueueType[]>(initialQueues);
  const [players, setPlayers] = useState<Player[]>(playersUpdated);

  // REVIEW: rename to handleAddToShortestQueue ?
  const addItemToShortestQueue = async (itemId: string) => {
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

  // REVIEW: rename to handleAddToAllQueues ?
  // don't need async await?
  async function addAllToQueues(items: Player[]) {
    for (const item of items) {
      if (!item.assignedToQueue) {
        item.assignedToQueue = true;
        await addItemToShortestQueue(item.id);
      }
    }
  }

  // REVIEW: helper
  const findShortestQueue = (queues: QueueType[]) => {
    let shortestQueue = queues[0];
    queues.forEach(queue => {
      if (queue.queueItems.length < shortestQueue.queueItems.length) {
        shortestQueue = queue;
      }
    });
    return shortestQueue;
  };

  // REVIEW: rename to handleProgressOneStep ?
  const progressQueueOneStep = (queueIndex: number) => {
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

  // REVIEW: rename to handleRedistributeQueues ?
  function redestributeQueues(queues) {
    const shortestQueue = findShortestQueue(queues);

    const shortestQLength = shortestQueue.queueItems.length;

    const slicedQTailCollection = [];
    const stumps = [];

    for (let i = 0; i < queues.length; i++) {
      const slicedTail = queues[i].queueItems.slice(shortestQLength);
      slicedQTailCollection.push(slicedTail);
      stumps.push(queues[i].queueItems.slice(0, shortestQLength));
    }
    const tempQ = [];
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

  return (
    <div className="flex flex-col bg-red-300">
      <h1>Queue Management</h1>

      <div className="p-8 bg-green-200">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Unprocessed Players</h2>
        </header>

        <PlayersList
          players={players}
          addItemToShortestQueue={addItemToShortestQueue}
        />
      </div>
      <div className="flex flex-row justify-around">
        <button
          className="bg-gray-300 text-black py-2 h-[45px] w-[250px] px-4 rounded"
          onClick={() => {
            addAllToQueues(players.filter(player => !player.assignedToQueue));
          }}>
          Add All Players to Queues
        </button>
        <button
          className="bg-blue-500 text-black py-2 h-[45px] w-[250px] px-4 rounded"
          onClick={() => {
            redestributeQueues(queues);
          }}>
          Redestribute Players
        </button>
      </div>

      <div className=" p-8 bg-blue-100">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-700 text-center">Queues</h2>
        </header>

        <QueuesGrid
          queues={queues}
          setQueues={setQueues}
          //REVIEW: the player state & its setter aren't used in QueuesGrid
          players={players}
          setPlayers={setPlayers}
          onProgress={progressQueueOneStep}
        />
      </div>

      <div className="p-8 bg-yellow-200">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Processed Players</h2>
        </header>

        <ProcessedPlayers
          players={players}
          addItemToShortestQueue={addItemToShortestQueue}
        />
      </div>
    </div>
  );
};

export default App;

// FIXME: trying to extract both player fields into one comp
// function Players({players, addItemToShortestQueue, isProcessed}) {
//   const unprocessedPlayers = players.filter(player => !player.assignedToQueue);
//   const processedPlayers = players.filter(player => {
//     // console.log(player)
//     return player.processedThroughQueue;
//   });

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {players.map(player => (
//         <div
//           key={player.id}
//           className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
//           <span className="text-white font-bold">{player.name}</span>
//           {!player.assignedToQueue && (
//             <button
//               onClick={() => addItemToShortestQueue(player.id)}
//               className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
//               Add to Shortest Queue
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// COMPONENT: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
function PlayersList({
  players,
  addItemToShortestQueue
}: {
  players: Player[];
  addItemToShortestQueue: (id: string) => QueueType[];
}) {
  const unprocessedPlayers = players.filter(
    player => !player.assignedToQueue && !player.processedThroughQueue
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {unprocessedPlayers.map(player => (
        <div
          key={player.id}
          className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
          <span className="text-white font-bold">{player.names}</span>
          {!player.assignedToQueue && (
            <button
              onClick={() => addItemToShortestQueue(player.id)}
              className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// COMPONENT:
function ProcessedPlayers({
  players,
  addItemToShortestQueue
}: {
  players: Player[];
  addItemToShortestQueue: (id: string) => QueueType[];
}) {
  const processedPlayers = players.filter(player => {
    return player.processedThroughQueue;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {processedPlayers.map((player: Player) => (
        <div
          key={player.id}
          className="bg-blue-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
          <span className="text-white font-bold">{player.names}</span>

          {!player.assignedToQueue && (
            <button
              onClick={() => addItemToShortestQueue(player.id)}
              className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// COMPONENT:
function QueuesGrid({
  queues,
  onProgress,
  setQueues
}: {
  queues: QueueType[];
  onProgress: (index: number) => QueueType[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {queues.map((queue, index) => (
        <Queue
          key={queue.id}
          //REVIEW: move classname directly on the returned div? = fewer props to pass
          className={
            "bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
          }
          onProgress={onProgress}
          queue={queue}
          index={index}
          setQueues={setQueues}
        />
      ))}
    </div>
  );
}

// COMPONENT:
function Queue({queue, setQueues, className, onProgress, index}) {
  const [draggedItem, setDraggedItem] = useState<Player>(null);
  const handleDragStart = draggedItem => setDraggedItem(draggedItem);
  const handleDragOver = (e, targetItem) => e.preventDefault();

  // does the main dragndrop
  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = queue.queueItems.findIndex(
      item => item.id === draggedItem.id
    );
    const targetIndex = queue.queueItems.findIndex(item => item.id === targetItem.id);

    const updatedOrder = [...queue.queueItems];
    // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
    updatedOrder.splice(draggedIndex, 1); //this removes the item and places it where we want
    // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
    updatedOrder.splice(targetIndex, 0, draggedItem);

    setQueues(prevQueues => {
      return prevQueues.map((q, idx) => {
        if (q.id === queue.id) {
          q.queueItems = updatedOrder;
        }
        return q;
      });
    });

    setDraggedItem(null);
  };

  return (
    <div className={className}>
      <div className="flex flex-row justify-around">
        <h3 className="text-xl font-semibold text-purple-600 mb-4">
          Queue {queue.queueName}
        </h3>
      </div>
      {/* Progress Button */}
      {queue.queueItems.length > 0 && (
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
          onClick={() => onProgress(index)}>
          Progress Queue
        </button>
      )}
      {queue.queueItems.length > 0 ? (
        <ul className="mb-4">
          {/* REVIEW: item should be a player */}
          {queue.queueItems.map((item, index) => (
            <QueueItem
              key={item.id}
              //REVIEW: move classname directly on the returned div? = fewer props to pass
              className={`${
                index === 0 ? "bg-purple-200" : "bg-red-100"
              }  text-purple-800 p-2 rounded-lg mb-2`}
              item={item}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-4">No items in queue</p>
      )}
    </div>
  );
}

// COMPONENT:
function QueueItem({item, className, onDragStart, onDragOver, onDrop}) {
  return (
    <li
      className={className}
      // for DRAGNDROP
      draggable
      onDragStart={() => onDragStart(item)}
      onDragOver={e => onDragOver(e, item)}
      onDrop={e => onDrop(e, item)}>
      {item.names}
    </li>
  );
}
