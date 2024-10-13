import Button from "./Button";
// types
import Player from "@/types/Player.js";
import QueueType from "@/types/Queue.js";

// NOTE: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
export default function PlayersList({
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
            <Button
              onClick={() => addItemToShortestQueue(player.id)}
              className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

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
//             <Button
//               onClick={() => addItemToShortestQueue(player.id)}
//               className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
//               Add to Shortest Queue
//             </Button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
