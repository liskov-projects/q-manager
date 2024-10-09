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

// Initialize players with assignedToQueue property
const playersUpdated = players.map(player => {
  player.assignedToQueue = false;
  player.processedThroughQueue = false;
  return player;
});

// TYPES:
// type Player = {
//   id: number;
//   name: string;
//   category: string;
//   mobileNumber: string;
// };

// type Queue = {
//   queueName: string;
//   queueItems: Player[];
//   id: string;
// };
// Initial queue setup
const initialQueues = [
  {queueName: "1", queueItems: [], id: "0987"},
  {queueName: "2", queueItems: [], id: "1234"},
  {queueName: "3", queueItems: [], id: "5678"},
  {queueName: "4", queueItems: [], id: "4321"}
];

const App = () => {
  // loos like this:  [ {queueName: 1, queueItems: []}, ... ],
  const [queues, setQueues] = useState(initialQueues);
  const [players, setPlayers] = useState(playersUpdated);

  // NOTE: seems to work | itemID ~ player.id | queueId ~ 3
  const addItemToShortestQueue = itemId => {
    // Find the item based on itemId
    const itemToUpdate = players.find(player => player.id === itemId);

    console.log(itemToUpdate);

    if (!itemToUpdate) {
      console.error("Item not found");
      return;
    }

    const shortestQueue = findShortestQueue(queues);
    console.log(shortestQueue);

    // Create a new object with assignedToQueue set to true
    const updatedItem = {
      ...itemToUpdate,
      assignedToQueue: true
    };
    console.log(updatedItem);

    shortestQueue.queueItems.push(updatedItem);

    const newQueues = queues.map(queue => {
      if (queue.id == shortestQueue.id) {
        return shortestQueue;
      }
      return queue;
    });

    console.log("NEW QUEUES");
    console.log(newQueues);

    // Update the players array immutably, ensuring assignedToQueue is set to true
    const newPlayers = players.map(player =>
      player.id === itemId ? updatedItem : player
    );
    console.log("clicked on a processed item");
    // Update both players and queues state
    setPlayers(newPlayers);
    setQueues(newQueues);
  };

  // FIXME:
  function addAllToQueues(items, queues) {
    //get how many items in a queue
    const totalItems = items.length;

    let j = 0;
    for (let i = 0; i < totalItems; i++) {
      const totalQueues = queues.length;
      // console.log("item: ", items[i], "queue stump: ", queues[j]);
      if (j == totalQueues) j = 0;
      addItemToShortestQueue(items[i]);
      j++;
    }
  }

  // NEW:
  const findShortestQueue = queues => {
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
  const progressQueueOneStep = queueIndex => {
    const newQueues = [...queues];
    const processedPlayer = newQueues[queueIndex].queueItems.shift();

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
      </div>

      <button
        className="bg-gray-300 text-black py-2 h-[45px] w-[250px] px-4 rounded"
        onClick={() => addAllToQueues(players, queues)}>
        Add All Players to Queues
      </button>

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
      </div>
    </div>
  );
};

export default App;

// COMPONENT: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
function PlayersList({players, addItemToShortestQueue}) {
  const unprocessedPlayers = players.filter(player => !player.assignedToQueue);
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

// COMPONENT: procesed Players
function ProcessedPlayers({players, addItemToShortestQueue}) {
  console.log("PLAYERS ********");
  console.log(players);
  const processedPlayers = players.filter(player => {
    // console.log(player)
    return player.processedThroughQueue;
  });
  console.log("PROCESSED PLAYERS");
  console.log(processedPlayers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {processedPlayers.map(player => (
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

// COMPONENT: {/* Queues Grid */}
function QueuesGrid({queues, setQueues, players, setPlayers, onProgress}) {
  console.log(queues);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {queues.map((queue, index) => (
        <div
          key={queue.id}
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">
            Queue {queue.queueName}
          </h3>

          {/* Queue Items extract later */}
          {queues[index].queueItems.length > 0 ? (
            <ul className="mb-4">
              {queue.queueItems.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-purple-200 text-purple-800 p-2 rounded-lg mb-2">
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mb-4">No items in queue</p>
          )}
          {/* <QueueItems queues={queues} /> */}
          {/* Progress Button */}
          {queue.queueItems.length > 0 && (
            <button
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
              onClick={() => onProgress(index)}>
              Progress Queue
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// function QueueItems({queues}) {
//   return (
//     <>
//       {queues.map((queue, index) => {
//         queue.queueItems.length > 0 ? (
//           <ul className="mb-4">
//             {queue.queueItems.map((item, idx) => (
//               <li
//                 key={idx}
//                 className="bg-purple-200 text-purple-800 p-2 rounded-lg mb-2">
//                 {item.name}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-600 mb-4">No items in queue</p>
//         );
//       })}
//       ;
//     </>
//   );
// }
