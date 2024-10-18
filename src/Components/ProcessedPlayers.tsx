import Button from "./Button";
// types
import Player from "@/types/Player";
// context
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";
import PlayerItem from "./PlayerItem";

export default function ProcessedPlayers() {
  const {players, handleDragStart, handleDragOver, handleDrop} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  const processedPlayers = players.filter(player => {
    return player.processedThroughQueue;
  });

  return (
    <ul className="flex flex-col bg-green-600">
      {processedPlayers.map((player: Player) => (
        <li
          key={player.id}
          className="bg-blue-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between my-2"
          draggable
          onDragStart={() => handleDragStart(player)}
          onDragOver={e => handleDragOver(e)}
          onDrop={e => handleDrop(e, player)}>
          <PlayerItem className="" item={player}>
            {player.names}
          </PlayerItem>
          {!player.assignedToQueue ? (
            <Button
              onClick={() => handleAddToShortestQueue(player.id)}
              className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
