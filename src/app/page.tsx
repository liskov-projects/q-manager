"use client";

// import "./App.css";
//components
// import Button from "./components/Button";
// import CourtForm from "./components/CourtForms";
// import NewPlayerForm from "./components/NewPlayerForm";
// import PlayersList from "./components/PlayersList";
//NOTE: hooks
import {useState} from "react";
//mock data

import players from "../data/players.js";

// TYPES:
type Player = {
  // as in Mongo later
  id: string;
  name: string;
  category: string;
  mobileNumber: string;
  assignedToQueue: boolean;
  processedThroughQueue: boolean;
};

type Queue = {
  queueName: string;
  queueItems: Player[];
  id: string;
};

// Initial queue setup
const initialQueues: Queue[] = [
  {queueName: "1", queueItems: [], id: "0987"},
  {queueName: "2", queueItems: [], id: "1234"},
  {queueName: "3", queueItems: [], id: "5678"}
  // {queueName: "4", queueItems: [], id: "4321"}
];

// Initialize players with assignedToQueue property
const playersUpdated = players.map(player => {
  player.assignedToQueue = false;
  player.processedThroughQueue = false;
  return player;
});

const App = () => {
  const [queues, setQueues] = useState<Queue[]>(initialQueues);
  const [players, setPlayers] = useState<Player[]>(playersUpdated);

  // FIXME:
  const addItemToShortestQueue = async (itemId: string) => {
    // Find the item based on itemId
    const itemToUpdate = players.find(player => player.id === itemId);

    // console.log(itemToUpdate);
    // this is a tempQ item
    // console.log(itemId);

    if (!itemToUpdate) {
      console.error("Item not found");
      return;
    }

    const shortestQueue = findShortestQueue(queues);
    // console.log(shortestQueue);

    // Create a new object with assignedToQueue set to true
    const updatedItem = {
      ...itemToUpdate,
      assignedToQueue: true
    };

    // console.log("UPDATED ITEM");
    // console.log(updatedItem);

    shortestQueue.queueItems.push(updatedItem);

    const newQueues = queues.map(queue => {
      if (queue.id == shortestQueue.id) {
        return shortestQueue;
      }
      return queue;
    });

    // console.log("NEW QUEUES");
    // console.log(newQueues);

    setPlayers(prevPlayers =>
      prevPlayers.map(player => (player.id === itemId ? updatedItem : player))
    );
    // console.log("NEW PLAYERS");
    // console.log(players);

    // do the same as with Players?
    await setQueues(newQueues);
  };

  // don't need async await?
  async function addAllToQueues(items: Player[]) {
    //get how many items in a queue
    // const totalItems = items.length;
    console.log("these are items:", items);
    // for (let i = 0; i < totalItems; i++) {
    // const newItems = items.map(async item => {
    for (const item of items) {
      if (!item.assignedToQueue) {
        // doesn't update the state properly
        item.assignedToQueue = true;
        // console.log("SENDING ITEM TO QUEUE");
        // console.log(item);
        // console.log("CURRENT QUEUEs");
        // console.log(queues);
        await addItemToShortestQueue(item.id);
      }
    }
    // setPlayers(newItems);
  }

  const findShortestQueue = (queues: Queue[]) => {
    let shortestQueue = queues[0];
    queues.forEach(queue => {
      if (queue.queueItems.length < shortestQueue.queueItems.length) {
        shortestQueue = queue;
      }
    });
    return shortestQueue;
  };
  // Function to add all players to the queues

  // const addAllToQueues = () => {
  //   const newQueues = [...queues];
  //   const totalItems = players.length;
  //   let queueIndex = 0;

  //   for (let i = 0; i < totalItems; i++) {
  //     if (queueIndex === newQueues.length) queueIndex = 0;
  //     addItemToShortestQueue(players[i], queueIndex);
  //     queueIndex++;
  //   }
  // };

  // Function to progress a queue one step

  // NOTE: seems to work
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

  // REVIEW: potential trouble with state update
  //seems to work | candidate to go into utils file
  // function queueSlicer(queues) {
  //   // console.log("these are queues entering queueSlicer", queues);
  //   const shortestQueue = findShortestQueue(queues);
  //   // console.log("these this is the shortest q", shortestQueue);

  //   const shortestQLength = shortestQueue.queueItems.length;
  //   // console.log(
  //   //   "these this is the IDX to use to slice (shortest q length)",
  //   //   shortestQLength
  //   // );

  //   const slicedQTailCollection = [];
  //   const stumps = [];
  //   for (let i = 0; i < queues.length; i++) {
  //     slicedQTailCollection.push(queues[i].queueItems.slice(shortestQLength));
  //     stumps.push(queues[i].queueItems.slice(0, shortestQLength));
  //   }
  //   console.log("SLICER stumps are: ", stumps);
  //   console.log("SLICER slicedCollectios are: ", slicedQTailCollection);

  //   return {stumps, slicedQTailCollection};
  // }

  // REVIEW:
  function redestributeQueues(queues) {
    console.log("these are queues entering redistributor", queues);
    const shortestQueue = findShortestQueue(queues);
    console.log("these this is the shortest q", shortestQueue);

    const shortestQLength = shortestQueue.queueItems.length;
    console.log(
      "these this is the IDX to use to slice (shortest q length)",
      shortestQLength
    );

    const slicedQTailCollection = [];
    const stumps = [];

    for (let i = 0; i < queues.length; i++) {
      console.log("queue at idx ", queues[i].queueItems);
      const slicedTail = queues[i].queueItems.slice(shortestQLength);
      console.log("item to push ", slicedTail);
      slicedQTailCollection.push(slicedTail);
      // works as expected
      stumps.push(queues[i].queueItems.slice(0, shortestQLength));
    }

    console.log("stumps are: ", stumps);
    console.log("slicedQTailCollection is: ", slicedQTailCollection);

    const tempQ = [];
    // runs if there's someone left in the any of the slices
    while (slicedQTailCollection.some(q => q.length > 0)) {
      console.log("WHILE LOOP");
      console.log("SLICED Q TAIL COLLECTION");
      console.log(slicedQTailCollection);
      // for every sliceCollection if it's not empty run .shift & .push into tempQ
      // for (let i = 0; i < slicedQTailCollection.length; i++) {
      slicedQTailCollection.forEach(tail => {
        if (tail.length > 0) {
          const itemToPush = tail.shift();
          tempQ.push(itemToPush);
        }
      });
    }

    //this is what we expect to have & in the right order
    console.log("tempQ", tempQ);

    // this make sure we update state correctly
    // const newQueues = queues.map((queue, idx) => {
    //   return {...queue, queueItems: stumps[idx]};
    // });
    // // FIXME:
    // for (let i = 0; i < tempQ.length; i++) {
    //   newQueues.forEach(queue => {
    //     // if (!queue.queueItems.includes(tempQ[i])) queue.queueItems.push(tempQ[i]);
    //     queue.queueItems.push(tempQ[i]);
    //   });
    // }
    // add the tempQ to the stumps
    tempQ.forEach((qItem, index) => {
      const stumpIndex = index % stumps.length;
      stumps[stumpIndex].push(qItem);
    });

    console.log("STUMPS FINAL - to be added to QUEUES ", stumps);

    const newQueues = queues.map((queue, index) => {
      return {...queue, queueItems: stumps[index]};
    });

    setQueues(newQueues);
  }

  return (
    <div className="flex flex-col bg-red-300">
      <h1>Queue Management</h1>

      <div className="p-8 bg-green-200">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Unprocessed Players</h2>
        </header>

        {/* Grid of Player Cards */}
        <PlayersList
          players={players}
          addItemToShortestQueue={addItemToShortestQueue}
        />
        {/* <Players players={players} addItemToShortestQueue={addItemToShortestQueue}/> */}
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
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-700 text-center">Queues</h2>
        </header>

        {/* Queues Grid */}
        {/* COMPONENT: */}
        <QueuesGrid
          queues={queues}
          setQueues={setQueues}
          players={players}
          setPlayers={setPlayers}
          onProgress={progressQueueOneStep}
        />
      </div>

      {/* OLD: */}
      <div className="p-8 bg-yellow-200">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Processed Players</h2>
        </header>

        {/* Grid of Processed Player Cards */}
        <ProcessedPlayers
          players={players}
          addItemToShortestQueue={addItemToShortestQueue}
        />
        {/* <Players players={players} addItemToShortestQueue={addItemToShortestQueue}/> */}
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
  addItemToShortestQueue: (id: string) => Queue[];
}) {
  const unprocessedPlayers = players.filter(
    // added !player.processedThroughQueue to ensure item doesn't appear in the top area again
    player => !player.assignedToQueue && !player.processedThroughQueue
  );
  // console.log(unprocessedPlayers);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {unprocessedPlayers.map(player => (
        <div
          key={player.id}
          className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
          <span className="text-white font-bold">{player.name}</span>
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
  addItemToShortestQueue: (id: string) => Queue[];
}) {
  // console.log("PLAYERS ********");
  // console.log(players);
  const processedPlayers = players.filter(player => {
    // console.log(player)
    return player.processedThroughQueue;
  });
  // console.log("PROCESSED PLAYERS");
  // console.log(processedPlayers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {processedPlayers.map((player: Player) => (
        <div
          key={player.id}
          className="bg-blue-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
          <span className="text-white font-bold">{player.name}</span>

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
  queues: Queue[];
  onProgress: (index: number) => Queue[];
}) {
  // console.log(queues);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {queues.map((queue, index) => (
        <Queue
          key={queue.id}
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

// getting ready to implement drag and drop
// COMPONENT:
function Queue({queue, setQueues, className, onProgress, index}) {
  // DRAG N DROP
  const [draggedItem, setDraggedItem] = useState(null);

  // don't need to use prevDragged cause we don't care?
  const handleDragStart = draggedItem => setDraggedItem(draggedItem);
  const handleDragOver = (e, targetItem) => e.preventDefault();

  // does the bulk of the drag n drop
  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = queue.queueItems.findIndex(
      item => item.id === draggedItem.id
    );
    const targetIndex = queue.queueItems.findIndex(item => item.id === targetItem.id);

    // modifying the queue
    const updatedOrder = [...queue.queueItems];
    // removes the draggeed item
    updatedOrder.splice(draggedIndex, 1);
    // inserts it back
    updatedOrder.splice(targetIndex, 0, draggedItem);

    // FIXME: potential cause of the crash when the item is released
    setQueues(prevQueues => {
      prevQueues.map((q, idx) => ({...q, updatedOrder}));
    });

    setDraggedItem(null);
  };

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold text-purple-600 mb-4">
        Queue {queue.queueName}
      </h3>
      {queue.queueItems.length > 0 ? (
        <ul className="mb-4">
          {queue.queueItems.map((item, idx) => (
            <QueueItem
              key={idx}
              className={"bg-purple-200 text-purple-800 p-2 rounded-lg mb-2"}
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

      {/* Progress Button */}
      {queue.queueItems.length > 0 && (
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
          onClick={() => onProgress(index)}>
          Progress Queue
        </button>
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
      {item.name}
    </li>
  );
}
