// hooks
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useUser } from "@clerk/nextjs";
import useDragNDrop from "@/hooks/useDragNDrop";
// types
import { TPlayer } from "@/types/Types";
// components
import TagsList from "../TagsList";
import StarItem from "@/Components/Buttons/StarItem";
import { useState } from "react";

export default function QueueListItem({
  item,
  className,
}: {
  item: TPlayer;
  className: string;
  queueId: string;
  index: number;
}) {
  const { handleDragStart, handleDragOver } = useDragNDrop();
  const { tournamentOwner } = useTournamentsAndQueuesContext();
  const { isSignedIn } = useUser();

  // NOTE: star background?
  return (
    <div
      key={item._id}
      id={item._id}
      className={`p-2 shadow-left-bottom-lg w-[95%] left-bottom-lg rounded-lg mb-2 text-center ${className}`}
      draggable={`${!tournamentOwner ? false : true}`}
      onDragStart={() => handleDragStart(item)}
      onDragOver={(e) => handleDragOver(e)}
    >
      <div className="flex">
        <div className="player-name font-bold w-[70%]">{item.names}</div>
        {isSignedIn ? <StarItem playerId={item._id} /> : null}
      </div>
      <TagsList item={item} />
    </div>
  );
}
