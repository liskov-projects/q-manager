import {useState} from "react";
import useAddToQueues from "@/Hooks/useAddToQueues";
import Button from "./Buttons/Button";
// context
import {useAppContext} from "@/Context/AppContext";
import PlayerItem from "./PlayerItem";

// FIXME: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
export default function PlayersList() {
  // NEW:
  const [search, setSearch] = useState("");
  //
  const {players, handleDragStart, handleDragOver, fetchPlayers} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  //NOTE: use to be a source of bugs for unprocessAllButton
  const unprocessedPlayers = players.filter(
    player =>
      !player.assignedToQueue &&
      !player.processedThroughQueue &&
      // NEW:
      player.names.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // REVIEW: viewport height
    <ul className="flex flex-col h-[70vh] overflow-hidden hover:overflow-y-auto">
      {/* NEW:  fetches new players after they're submitted through the form*/}
      <Button
        onClick={fetchPlayers}
        className={
          "ml-6 my-4 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
        }>
        update players
      </Button>
      <input
        className="focus:outline-none focus:ring-2 focus:ring-brick-200"
        type="text"
        placeholder="search player..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {unprocessedPlayers.map(player => (
        <li
          key={player._id}
          className="h-30 p-4 rounded-lg shadow-md flex flex-row justify-between my-2 bg-shell-100"
          draggable
          onDragStart={() => handleDragStart(player)}
          onDragOver={e => handleDragOver(e)}>
          <PlayerItem className="" item={player}>
            {player.names}
          </PlayerItem>
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
