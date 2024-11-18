import {useState, Fragment} from "react";
import useAddToQueues from "@/hooks/useAddToQueues";
import useDragNDrop from "@/hooks/useDragNDrop";
import Button from "./Buttons/Button";
import DropZone from "./DropZone";
import SectionHeader from "./SectionHeader";
// context
import {useAppContext} from "@/context/QueuesContext";
import {useUser} from "@clerk/nextjs";

import PlayerListItem from "./PlayerListItem";
import PlayerType from "@/types/Player";
// import DropDownFilter from "./DropDownFilter";

// FIXME: {/* Grid of Player Cards potentially the same comp as Processed Pl*/}
export default function PlayersList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const {isSignedIn} = useUser();
  const {players, uniqueCategories, fetchPlayers} = useAppContext();
  const {handleAddToShortestQueue} = useAddToQueues();
  const {handleDrop} = useDragNDrop();

  const unprocessedPlayers = players.filter(player => {
    // new vars for logic to keep it cleaner
    const matchesSearch = player.names?.toLowerCase().includes(search.toLowerCase());
    const unassigned = !player.assignedToQueue && !player.processedThroughQueue;

    if (filter === "show all" || filter === "") {
      return unassigned && matchesSearch;
    } else {
      return unassigned && matchesSearch && player.categories?.includes(filter);
    }
  });

  return (
    // REVIEW: viewport height
    <>
      <SectionHeader>Unprocessed Players</SectionHeader>
      <div className="flex flex-col shadow-left-bottom-lg items-center h-[70vh] overflow-hidden hover:overflow-y-auto">
        {!isSignedIn ? null : (
          <Button
            onClick={fetchPlayers}
            className={
              "ml-6 my-4 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
            }>
            UPDATE PLAYERS
          </Button>
        )}
        {/* TODO: extract into a separate comp? */}
        <input
          className="focus:outline-none focus:ring-2 focus:ring-brick-200 my-4"
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
        <ul className="flex flex-col items-center">
          {unprocessedPlayers.map((player: PlayerType, index) => (
            <Fragment key={player._id}>
              <PlayerListItem
                item={player}
                className="h-30 w-[92%] p-2 bg-slate-200 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
                onAddToQueue={() => handleAddToShortestQueue(player._id)}
              />
              <DropZone
                height={60}
                index={index}
                dropTarget="unprocessed" // drop target for unprocessed players
                onDrop={e => handleDrop({e, dropTarget: "unprocessed", index})}
              />
            </Fragment>
          ))}
        </ul>
      </div>
    </>
  );
}
