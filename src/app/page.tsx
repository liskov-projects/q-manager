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

// Initial queue setup
const initialQueues = [
  {queueNumber: 1, queueItems: []},
  {queueNumber: 2, queueItems: []},
  {queueNumber: 3, queueItems: []},
  {queueNumber: 4, queueItems: []}
];

const App = () => {
  // loos like this:  [ {queueNumber: 1, queueItems: []}, ... ],
  const [queues, setQueues] = useState(initialQueues);
  const [players, setPlayers] = useState(playersUpdated);

  // FIXME: mutating state (not anymore with newQueue?)
  function addItemToQueue(item, queue, queues) {
    item.assignedToQueue = true;

    //should look like this:  [ {queueNumber: 1, queueItems: []} ],
    const newQueue = [...queues];

    newQueue[queue].queueItems.push(item);
    setQueues(prev => [...prev, newQueue]);
    return queue;
  }

  // // Function to add a player to a queue
  // const addItemToQueue = (item, queueIndex) => {
  //   const newQueues = [...queues];
  //   const newPlayers = [...players];

  //   newPlayers[item.id - 1].assignedToQueue = true;
  //   newQueues[queueIndex].queueItems.push(newPlayers[item.id - 1]);

  //   setPlayers(newPlayers);
  //   setQueues(newQueues);
  // };

  // FIXME:
  function addAllToQueues(items, queues) {
    //get how many items in a queue
    const totalItems = items.length;

    let j = 0;
    for (let i = 0; i < totalItems; i++) {
      const totalQueues = queues.length;
      // console.log("item: ", items[i], "queue stump: ", queues[j]);
      if (j == totalQueues) j = 0;
      addItemToQueue(items[i], queues[j]);
      j++;
    }
  }

  // Function to add all players to the queues

  // const addAllToQueues = () => {
  //   const newQueues = [...queues];
  //   const totalItems = players.length;
  //   let queueIndex = 0;

  //   for (let i = 0; i < totalItems; i++) {
  //     if (queueIndex === newQueues.length) queueIndex = 0;
  //     addItemToQueue(players[i], queueIndex);
  //     queueIndex++;
  //   }
  // };

  // Function to progress a queue one step
  const progressQueueOneStep = queueIndex => {
    const newQueues = [...queues];
    const item = newQueues[queueIndex].queueItems.shift();
    item.processedThroughQueue;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map(player => (
            <div
              key={player.id}
              className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
              <span className="text-white font-bold">{player.name}</span>
              {!player.assignedToQueue && (
                <button
                  onClick={() => addItemToQueue(player, 0, queues)} // Add to first queue as an example
                  className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
                  Add to Queue 1
                </button>
              )}
            </div>
          ))}
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {queues.map((queue, index) => (
            <div
              key={queue.queueNumber}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">
                Queue {queue.queueNumber}
              </h3>

              {/* Queue Items */}
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

              {/* Progress Button */}
              {queue.queueItems.length > 0 && (
                <button
                  className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
                  onClick={() => progressQueueOneStep(index)}>
                  Progress Queue
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-yellow-200">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Processed Players</h2>
        </header>

        {/* Grid of Player Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map(player => (
            <div
              key={player.id}
              className="bg-blue-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
              <span className="text-white font-bold">{player.name}</span>
              {player.processedThroughQueue && (
                <button
                  onClick={() => addItemToQueue(player, 0)} // Add to first queue as an example
                  className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out">
                  Add to Queue 1
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

// function PlayersList({players}) {
//   return (
//     <>
//       <ul>
//         {players.map(player => {
//           return (
//             <li className="player" key={player.id}>
//               {player.name}
//             </li>
//           );
//         })}
//       </ul>
//     </>
//   );
// }
