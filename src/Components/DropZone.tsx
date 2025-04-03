"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";

type DropZoneProps = {
  isDraggedOver: boolean;
  hoveredDropZoneIndex: number | null;
  index: number;
  inEmptyList: boolean;
};

export default function DropZone({
  isDraggedOver,
  hoveredDropZoneIndex,
  index,
  inEmptyList,
}: DropZoneProps) {
  const { tournamentOwner } = useTournamentsAndQueuesContext();

  if (!tournamentOwner) return null;

  const isActive = (isDraggedOver && hoveredDropZoneIndex === index) || inEmptyList;

  return (
    <div
      className="drop-zone w-[95%] transition-all duration-200 bg-gray-300 my-2 rounded"
      style={{
        height: isActive ? "50px" : "0px",
      }}
    />
  );
}
