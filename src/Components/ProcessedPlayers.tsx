import {useState} from "react";
import Button from "./Buttons/Button";
// types
import Player from "@/types/Player";
// context
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";
import PlayerItem from "./PlayerItem";

export default function ProcessedPlayers() {
  // NEW:
  const [search, setSearch] = useState("");

  const {players, handleDragStart, handleDragOver} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  const processedPlayers = players
    .filter(player => {
      return player.processedThroughQueue;
    })
    // NEW:
    .filter(player => player.names.toLowerCase().includes(search.toLowerCase()));

  return (
    <ul className="flex flex-col h-[70vh] overflow-hidden hover:overflow-y-auto">
      {/* NEW: */}
      <input
        className="focus:outline-none focus:ring-2 focus:ring-brick-200"
        type="text"
        placeholder="search player..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {processedPlayers.map((player: Player) => (
        <li
          key={player._id}
          className="h-30 p-4 rounded-lg shadow-md flex flex-row justify-between my-2 bg-shell-100"
          draggable
          onDragStart={() => handleDragStart(player)}
          onDragOver={e => handleDragOver(e)}>
          <PlayerItem item={player}>{player.names}</PlayerItem>
          {!player.assignedToQueue ? (
            <Button
              onClick={() => handleAddToShortestQueue(player._id)}
              className="px-4 py-2 rounded bg-tennis-50 hover:bg-tennis-200 hover:text-shell-300 transition-colors duration-200 ease-in-out">
              Add to Shortest Queue
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
