import {useState, Fragment} from "react";
import useAddToQueues from "@/hooks/useAddToQueues";
import useDragNDrop from "@/hooks/useDragNDrop";
import Button from "./Buttons/Button";
import DropZone from "./DropZone";
// context
import {useAppContext} from "@/Context/AppContext";
import PlayerListItem from "./PlayerListItem";
// import DropDownFilter from "./DropDownFilter";

// FIXME: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
export default function PlayersList() {
  // NEW:
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  //
  const {players, uniqueCategories, fetchPlayers} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();
  const {handleDrop} = useDragNDrop();

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

  return (
    // REVIEW: viewport height
    <ul className="flex flex-col h-[70vh] overflow-hidden hover:overflow-y-auto">
      <Button
        type="button"
        onClick={fetchPlayers}
        className={
          "ml-6 my-4 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
        }>
        update players
      </Button>
      {/* TODO: extract into a separate comp? */}
      <input
        className="focus:outline-none focus:ring-2 focus:ring-brick-200"
        type="text"
        placeholder="search player..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {/* TODO: dropdown categories list | extract*/}
      <div className="flex justify-center">
        <select
          className="bg-brick-200 my-2 rounded text-shell-100 p-2"
          onChange={e => setFilter(e.target.value)}>
          <option value="show all">show all...</option>
          {uniqueCategories.map((category, idx) => (
            <option key={idx} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {unprocessedPlayers.map((player, index) => (
        <Fragment key={player._id}>
          <PlayerListItem
            item={player}
            className="h-30 p-4 bg-slate-200 rounded-lg shadow-md flex flex-row justify-between items-center my-2"
            onAddToQueue={() => handleAddToShortestQueue(player._id)}
          />
          <DropZone
            height={60}
            index={index}
            dropTarget="unprocessed" // drop target for unprocessed players
            onDrop={event => handleDrop({event, dropTarget: "unprocessed", index})}
          />
        </Fragment>
      ))}
    </ul>
  );
}
