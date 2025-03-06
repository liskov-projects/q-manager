"use client";
// hooks
import {useState, Fragment} from "react";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
// components
import DropZone from "./DropZone";
import SectionHeader from "./SectionHeader";
import PlayerListItem from "./PlayerListItem";
// types
import {TPlayer} from "@/types/Types";

export default function PlayersList({
  title,
  players,
  zone
}: {
  title: string;
  players: TPlayer[];
  zone: string;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const {currentTournament} = useTournamentsAndQueuesContext();
  // NEW:
  const {handleDrop} = useDragNDrop();

  return (
    // REVIEW: viewport height
    <div id="modal-root">
      <SectionHeader>{title}</SectionHeader>
      <div className="flex flex-col shadow-left-bottom-lg items-center h-[70vh] overflow-hidden hover:overflow-y-auto">
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
            {currentTournament?.categories.map((category: string, index: number) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <ul className="flex flex-col items-center">
          {players.map((player: TPlayer, index: number) => (
            <Fragment key={player._id}>
              <PlayerListItem item={player} />
              <DropZone
                height={60}
                index={index}
                dropTarget="unprocessed" // drop target for unprocessed players
                // NEW:
                onDrop={e => handleDrop({e, dropTarget: zone, index})}
              />
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
