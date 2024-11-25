"use client";

// types
import Player from "@/types/Player";
import {useState} from "react";
// context
import {useQueuesContext} from "@/context/QueuesContext";
import useAddToQueues from "@/hooks/useAddToQueues";
import PlayerListItem from "./PlayerListItem";

export default function ProcessedPlayers() {
  const [search, setSearch] = useState("");

  const {players} = useQueuesContext();
  const {handleAddToShortestQueue} = useAddToQueues();

  const processedPlayers = players
    .filter(player => {
      return player.processedThroughQueue;
    })
    .filter(player => player.names?.toLowerCase().includes(search.toLowerCase()));

  return (
    <ul className="flex flex-col h-[70vh] overflow-hidden hover:overflow-y-auto">
      {/* TODO: extract into a separate comp ?*/}
      <input
        className="focus:outline-none focus:ring-2 focus:ring-brick-200"
        type="text"
        placeholder="search player..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {processedPlayers.map((player: Player) => (
        <PlayerListItem
          key={player._id}
          item={player}
          className="h-30 p-4 rounded-lg shadow-md flex flex-row justify-between items-center my-2"
          onAddToQueue={() => handleAddToShortestQueue(player._id)}
        />
      ))}
    </ul>
  );
}
