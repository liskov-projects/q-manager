import {useState, useMemo} from "react";
import useAddToQueues from "@/Hooks/useAddToQueues";
import Button from "./Buttons/Button";
// context
import {useAppContext} from "@/Context/AppContext";
import PlayerItem from "./PlayerItem";
// import DropDownFilter from "./DropDownFilter";

// FIXME: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
export default function PlayersList() {
  // NEW:
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  //
  const {players, uniqueCategories, handleDragStart, handleDragOver, fetchPlayers} =
    useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  //NOTE: use to be a source of bugs for unprocessAllButton

  const unprocessedPlayers = players.filter(player => {
    // new vars for logic to keep it cleaner
    const matchesSearch = player.names.toLowerCase().includes(search.toLowerCase());
    const unassigned = !player.assignedToQueue && !player.processedThroughQueue;

    if (filter === "show all" || filter === "") {
      return unassigned && matchesSearch;
    } else {
      return unassigned && matchesSearch && player.categories.includes(filter);
    }
  });

  // NEW:
  // const uniqueCategories = useMemo(() => {
  //   const categories = players.flatMap(player => player.categories || []);
  //   return Array.from(new Set(categories)); // Remove duplicates using Set
  // }, [players]);
  // console.log(uniqueCategories);
  //

  return (
    // REVIEW: viewport height
    <ul className="flex flex-col h-[70vh] overflow-hidden hover:overflow-y-auto">
      {/* NEW:  fetches new players after they're submitted through the form*/}
      <Button
        type="button"
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
      {/* NEW: */}
      <div>
        <select onChange={e => setFilter(e.target.value)}>
          <option value="show all">show all...</option>
          {uniqueCategories.map((category, idx) => (
            <option key={idx} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {/*  */}
      {unprocessedPlayers.map(player => (
        <li
          key={player._id}
          className="h-30 p-4 rounded-lg shadow-md flex flex-row justify-between my-2 bg-shell-100"
          draggable
          onDragStart={() => handleDragStart(player)}
          onDragOver={e => handleDragOver(e)}>
          <PlayerItem className="flex" item={player}>
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
