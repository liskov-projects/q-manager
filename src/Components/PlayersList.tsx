"use client";
// hooks
import { useState, Fragment } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
// components
import DropZone from "./DropZone";
import SectionHeader from "./SectionHeader";
import PlayerListItem from "./PlayerListItem";
// types
import { TPlayer } from "@/types/Types";

export default function PlayersList({
  title,
  players,
  zone,
}: {
  title: string;
  players: TPlayer[];
  zone: string;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const { currentTournament } = useTournamentsAndQueuesContext();

  const { handleDrop } = useDragNDrop();

  // decides how to filter the players list
  const filteredPlayers = players.filter((player: TPlayer) => {
    const matchesSearch =
      search.length === 0 || player.names.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filter === "show all" || filter.length === 0 || player.categories.includes(filter);

    return matchesSearch && matchesCategory;
  });

  return (
    // REVIEW: viewport height
    <div id="modal-root">
      <SectionHeader>{title}</SectionHeader>
      <div className="flex flex-col shadow-left-bottom-lg items-center h-auto overflow-hidden hover:overflow-y-auto w-full">
        {/* TODO: extract into a separate comp? */}
        <input
          className="focus:outline-none focus:ring-2 focus:ring-brick-200 my-2 py-2 px-2 rounded-sm"
          type="text"
          placeholder="Search matches"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* TODO: dropdown categories list | extract*/}
        <div className="flex justify-center">
          <select
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-50 my-2 rounded p-2"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="show all">show all...</option>
            {currentTournament?.categories.map((category: string, index: number) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <ul className="flex flex-col items-center w-full p-2">
          <DropZone />
          {players.length < 0 ? (
            <DropZone />
          ) : (
            // players
            //   .filter((player: TPlayer) => {
            //     // FIXME: waut to refactor?
            //     const matchesSearch = player.names.toLowerCase().includes(search.toLowerCase());
            //     const matchesCategory = filter === "show all" || player.categories.includes(filter);
            //     return matchesSearch && matchesCategory;
            //   })
            filteredPlayers.map((player: TPlayer, index: number) => (
              <div key={player._id}>
                <PlayerListItem item={player} />
                <DropZone
                  index={index}
                  dropTarget={zone} // zone specifies which field we're dropping into
                />
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
