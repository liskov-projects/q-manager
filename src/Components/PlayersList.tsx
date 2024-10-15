import useAddToQueues from "@/Hooks/useAddToQueues";
import Button from "./Button";
// context
import {useAppContext} from "@/Context/AppContext";
import PlayerItem from "./PlayerItem";

// FIXME: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
export default function PlayersList() {
  const {players, handleDragStart, handleDragOver, handleDrop} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  const unprocessedPlayers = players.filter(
    player => !player.assignedToQueue && !player.processedThroughQueue
  );
  return (
    <div
      className="flex flex-col"
      // className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {unprocessedPlayers.map(player => (
        <div
          draggable
          onDragStart={() => handleDragStart(player)}
          onDragOver={e => handleDragOver(e)}
          onDrop={e => handleDrop(e, player)}
          key={player.id}
          className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between my-2">
          <PlayerItem item={player}>{player.names}</PlayerItem>
          {!player.assignedToQueue && (
            <Button
              onClick={() => handleAddToShortestQueue(player.id)}
              className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
