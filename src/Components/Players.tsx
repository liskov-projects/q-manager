import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";
import Button from "./Button";
import PlayerItem from "./PlayerItem";
// FIXME: trying to extract both player fields into one comp
export default function Players({}) {
  const {players} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  const unprocessedPlayers = players.filter(player => !player.assignedToQueue);
  const processedPlayers = players.filter(player => {
    return player.processedThroughQueue;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {players.map(player =>
        player.assignedToQueue ? (
          <div
            key={player.id}
            className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
            <PlayerItem>{player.name}</PlayerItem>
            {/* <span className="text-white font-bold">{player.name}</span> */}
            {!player.assignedToQueue && (
              <Button
                onClick={() => addItemToShortestQueue(player.id)}
                className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
                Add to Shortest Queue
              </Button>
            )}
          </div>
        ) : (
          <div
            key={player.id}
            className="bg-purple-400 h-30 p-4 rounded-lg shadow-md flex flex-col justify-between">
            <span className="text-white font-bold">{player.names}</span>
            {!player.assignedToQueue && (
              <Button
                onClick={() => handleAddToShortestQueue(player.id)}
                className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200 ease-in-out">
                Add to Shortest Queue
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}
