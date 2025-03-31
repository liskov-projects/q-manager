"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";

type DropZoneProps = {
  isDraggedOver: boolean;
  hoveredDropZoneIndex: number | null;
  index: number;
};

export default function DropZone({ isDraggedOver, hoveredDropZoneIndex, index }: DropZoneProps) {
  const { tournamentOwner } = useTournamentsAndQueuesContext();

  if (!tournamentOwner) return null;

  const isActive = isDraggedOver && hoveredDropZoneIndex === index;

  return (
    <div
      className="drop-zone w-[95%] transition-all duration-200 bg-gray-300 my-2 rounded"
      style={{
        height: isActive ? "50px" : "0px",
      }}
    />
  );
}
