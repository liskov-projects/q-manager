"use client";
// hooks
import { useState, useRef } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
import { useSocket } from "@/context/SocketContext";
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

  const { currentTournament, draggedItem } = useTournamentsAndQueuesContext();
  // NEW:
  const [hoveredDropZoneIndex, setHoveredDropZoneIndex] = useState<number | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const { socket } = useSocket();

  // const { handleDrop } = useDragNDrop();
  // NEW:
  const dragCounter = useRef(0);

  const handleDragEnter = (itemIndex: number) => {
    dragCounter.current++;
    setIsDraggedOver(true);
    setHoveredDropZoneIndex(itemIndex);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggedOver(false);
      setHoveredDropZoneIndex(null);
    }
  };
  //
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
      <div className="flex flex-col shadow-left-bottom-lg items-center h-auto overflow-hidden hover:overflow-y-auto w-full mt-3 p-4">
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
            className="bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 py-2 px-3 my-2 rounded position-center"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="show all">Show all...</option>
            {currentTournament?.categories.map((category: string, index: number) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <ul className="flex flex-col items-center w-full">
          {players.length === 0 ? (
            <div
              onDragEnter={() => handleDragEnter(0)}
              onDragLeave={() => handleDragLeave()}
              onDrop={() => {
                console.log("DROP IN FRONT END");
                setIsDraggedOver(false);
                socket?.emit("playerDropped", {
                  message: "playerDropped from DropZone",
                  draggedItem,
                  dropTarget: zone,
                  index: 0,
                  tournamentId: currentTournament?._id,
                });
              }}
              onDragOver={(event) => {
                event.preventDefault();
              }}
            >
              <DropZone
                hoveredDropZoneIndex={hoveredDropZoneIndex}
                index={0}
                isDraggedOver={isDraggedOver}
                inEmptyList={true}
              />
            </div>
          ) : (
            filteredPlayers.map((player: TPlayer, index: number) => (
              <li
                className="w-full"
                key={player._id}
                onDragEnter={() => handleDragEnter(index)}
                onDragLeave={() => handleDragLeave()}
                onDrop={() => {
                  console.log("DROP IN FRONT END");
                  setIsDraggedOver(false);
                  socket?.emit("playerDropped", {
                    message: "playerDropped from DropZone",
                    draggedItem,
                    dropTarget: zone,
                    index: index,
                    tournamentId: currentTournament?._id,
                  });
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
              >
                <PlayerListItem item={player} />
                <DropZone
                  index={index}
                  dropTarget={zone} // zone specifies which field we're dropping into
                  hoveredDropZoneIndex={hoveredDropZoneIndex}
                  isDraggedOver={isDraggedOver}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
