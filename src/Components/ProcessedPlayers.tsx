import Button from "./Buttons/Button";
// types
import Player from "@/types/Player";
// context
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";
import PlayerItem from "./PlayerItem";

export default function ProcessedPlayers() {
  const {players, handleDragStart, handleDragOver} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  const processedPlayers = players.filter(player => {
    return player.processedThroughQueue;
  });

  return (
    <ul className="flex flex-col h-[70vh] overflow-hidden hover:overflow-y-auto">
      {processedPlayers.map((player: Player) => (
        <li
          key={player.id}
          className="h-30 p-4 rounded-lg shadow-md flex flex-col justify-between my-2"
          draggable
          onDragStart={() => handleDragStart(player)}
          onDragOver={e => handleDragOver(e)}
          >
          <PlayerItem className="" item={player}>
            {player.names}
          </PlayerItem>
          {!player.assignedToQueue ? (
            <Button
              onClick={() => handleAddToShortestQueue(player.id)}
              className="px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
