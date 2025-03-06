"use client";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {TQueue} from "@/types/Types";
import {useState} from "react";
import {useSocket} from "@/context/SocketContext";
export default function DropZone({
  onDrop,
  index,
  queue,
  height,
  dropTarget
}: {
  onDrop: (
    event: React.DragEvent<HTMLDivElement>,
    queue?: TQueue,
    index?: number
  ) => void;
  index?: number;
  queue?: TQueue;
  dropTarget?: TQueue | string;
  height: number;
}) {
  const {tournamentOwner, draggedItem, currentTournament} =
    useTournamentsAndQueuesContext();
  const {socket} = useSocket();

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragEnter = () => setIsDraggedOver(true);
  const handleDragLeave = () => setIsDraggedOver(false);

  // console.log("dropTarget in DropZone", dropTarget);

  if (!tournamentOwner) return null;
  return (
    <div
      className="drop-zone w-[95%] transition-all duration-200 bg-gray-200 my-2 rounded"
      style={{
        height: isDraggedOver ? `${height}px` : "20px",
        minHeight: "20px"
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={event => {
        setIsDraggedOver(false);
        // onDrop(event, queue, index);
        socket?.emit("playerDropped", {
          message: "playerDropped from DropZone",
          draggedItem,
          dropTarget,
          queue,
          index,
          tournamentId: currentTournament?._id
        });
      }}
      onDragOver={event => event.preventDefault()}
    />
  );
}
