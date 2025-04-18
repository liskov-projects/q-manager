"use client";

// hooks
import { useState, useEffect, useRef } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";

// components
import DropZone from "./DropZone";
import SectionHeader from "./SectionHeader";
import PlayerListItem from "./PlayerListItem";
import Button from "./Buttons/Button";
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
  const [filteredPlayers, setFilteredPlayers] = useState<TPlayer[]>([]);

  const { currentTournament, draggedItem } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();

  const [hoveredDropZoneIndex, setHoveredDropZoneIndex] = useState<number | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const dragCounter = useRef(0);

  // 🧠 Apply both search and category filters whenever they or the players list change
  useEffect(() => {
    const filtered = players.filter((player) => {
      const matchesSearch =
        search.trim().length === 0 || player.names.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filter === "" || filter === "show all" || player.categories.includes(filter);

      return matchesSearch && matchesCategory;
    });

    setFilteredPlayers(filtered);
  }, [players, search, filter]);

  // 🎯 Handle drag-end events to reset states
  useEffect(() => {
    const handleDragEnd = () => {
      setIsDraggedOver(false);
      setHoveredDropZoneIndex(null);
      dragCounter.current = 0;
    };

    window.addEventListener("dragend", handleDragEnd);
    return () => window.removeEventListener("dragend", handleDragEnd);
  }, []);

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

  return (
    <div id="modal-root">
      <div className="flex flex-col items-center">
        <SectionHeader>{title}</SectionHeader>
        <Button
          className="mt-2 bg-bluestone-200 border-2 border-transparent hover:bg-tennis-200 text-shell-50 hover:text-shell-300 py-2 h-fit w-fit px-4 rounded text-nowrap font-bold hover:border-2 hover:border-bluestone-200"
          onClick={() => {
            if (socket) {
              socket.emit("addAllFromOneList", {
                tournament: currentTournament,
                listName: title,
              });
            }
          }}
        >
          Add All
        </Button>
      </div>

      <div className="flex flex-col shadow-left-bottom-lg items-center h-auto overflow-hidden hover:overflow-y-auto w-full mt-3 p-4 rounded-lg">
        <input
          className="w-full focus:outline-none focus:ring-2 focus:ring-brick-200 my-2 py-2 px-2 rounded-sm border-2 border-gray-300"
          type="text"
          placeholder="Search matches"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex justify-center">
          <select
            className="bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 py-2 px-3 my-2 rounded position-center"
            value={filter}
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

        <ul className="flex flex-col items-center w-full ">
          {filteredPlayers.length === 0 ? (
            <li
              className="w-full"
              onDragEnter={() => handleDragEnter(0)}
              onDragLeave={() => handleDragLeave()}
              onDrop={() => {
                setIsDraggedOver(false);
                socket?.emit("playerDropped", {
                  message: "playerDropped from DropZone",
                  draggedItem,
                  dropTarget: zone,
                  index: 0,
                  tournamentId: currentTournament?._id,
                });
              }}
              onDragOver={(event) => event.preventDefault()}
            >
              <SectionHeader>No players here</SectionHeader>
              <DropZone
                hoveredDropZoneIndex={hoveredDropZoneIndex}
                index={0}
                isDraggedOver={isDraggedOver}
                inEmptyList={true}
              />
            </li>
          ) : (
            filteredPlayers.map((player: TPlayer, index: number) => (
              <li
                className="w-full"
                key={player._id}
                onDragEnter={() => handleDragEnter(index)}
                onDragLeave={() => handleDragLeave()}
                onDrop={() => {
                  setIsDraggedOver(false);
                  socket?.emit("playerDropped", {
                    message: "playerDropped from DropZone",
                    draggedItem,
                    dropTarget: zone,
                    index,
                    tournamentId: currentTournament?._id,
                  });
                }}
                onDragOver={(event) => event.preventDefault()}
              >
                <DropZone
                  index={index}
                  dropTarget={zone}
                  hoveredDropZoneIndex={hoveredDropZoneIndex}
                  isDraggedOver={isDraggedOver}
                />
                <PlayerListItem item={player} zone={zone} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
