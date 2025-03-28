"use client";
// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";
// types
import { TQueue } from "@/types/Types";

export default function DropZone({
  index,
  queue,
  dropTarget,
  height,
}: {
  index?: number;
  queue?: TQueue;
  dropTarget?: TQueue | string;
  height: number;
}) {
  const { tournamentOwner, draggedItem, currentTournament } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragEnter = () => setIsDraggedOver(true);
  const handleDragLeave = () => setIsDraggedOver(false);

  // console.log("dropTarget in DropZone", dropTarget);

  if (!tournamentOwner) return null;
  return (
    <div
      className="drop-zone w-[95%] transition-all duration-200 bg-gray-300 my-2 rounded"
      style={{
        height: isDraggedOver ? "90px" : "20px",
        minHeight: "20px",
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={() => {
        setIsDraggedOver(false);
        socket?.emit("playerDropped", {
          message: "playerDropped from DropZone",
          draggedItem,
          dropTarget,
          queue,
          index,
          tournamentId: currentTournament?._id,
        });
      }}
      onDragOver={(event) => event.preventDefault()}
    />
  );
}
