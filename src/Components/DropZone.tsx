"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";

type DropZoneProps = {
  isDraggedOver: boolean;
  hoveredDropZoneIndex: number | null;
  index: number;
  inEmptyList: boolean;
  isEndZone: boolean;
};

export default function DropZone({
  isDraggedOver,
  hoveredDropZoneIndex,
  index,
  inEmptyList,
  isEndZone,
}: DropZoneProps) {
  const { tournamentOwner, draggedItem } = useTournamentsAndQueuesContext();

  const isActive = isDraggedOver && draggedItem && hoveredDropZoneIndex === index;

  // let for working out the value
  let zoneHeight = "h-[0px]";

  if (inEmptyList) {
    zoneHeight = "h-[50px]";
  } else if (draggedItem === null) {
    zoneHeight = "h-[0px]";
  } else if (isEndZone) {
    // end of the list
    zoneHeight = isActive ? "h-[50px]" : "h-[25px]";
  } else {
    //between the ListItems
    zoneHeight = isActive ? "h-[50px]" : "h-[0px]";
  }

  if (!tournamentOwner) return null;

  return (
    <div
      className={`drop-zone w-[95%] transition-all duration-200 bg-gray-300 my-2 rounded oveflow-hidden ${zoneHeight}`}
    />
  );
}
