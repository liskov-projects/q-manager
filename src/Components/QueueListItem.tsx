import { useAppContext } from "@/Context/AppContext";
import Player from "@/types/Player";
import TagsList from "./TagsList";
import DropZone from "./DropZone";

export default function QueueListItem({
  item,
  className,
  queueId,
  index,
}: {
  item: Player;
  className: string;
  queueId: string;
  index: number;
}) {
  const { handleDragStart, handleDragOver, handleDropEvent } = useAppContext();

  return (
    <div
      key={item._id}
      id={item._id}
      onDrop={e => handleDropEvent(e, queueId, index)}
      className={`bg-shell-100 text-shell-200 p-2 rounded-lg mb-2 text-center ${className}`}
      draggable
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e)}
    >
      {/* Player Name */}
      <div className="player-name">
        {item.names}
      </div>
      
      {/* Tags List */}
      <TagsList item={item} />
      
      {/* Drop Zone */}
      <DropZone height={60} />
    </div>
  );
}
