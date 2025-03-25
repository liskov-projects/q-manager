// hooks
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
// types
import { TPlayer } from "@/types/Types";
// components
import TagsList from "../TagsList";
import StarItem from "@/Components/Buttons/StarItem";

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
      <div className="player-name">
        {item.names}

        <TagsList item={item} />
      </div>
      <StarItem playerId={item._id} />
    </div>
  );
}
