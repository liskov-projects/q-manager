import {useAppContext} from "@/Context/AppContext";
import Player from "@/types/Player";
import Button from "./Buttons/Button"; // Adjust the import if the button is in a different path
import TagsList from "./TagsList";

export default function PlayerListItem({
  item,
  className,
  onAddToQueue
}: {
  item: Player;
  className: string;
  queueId?: string;
}) {
  const {handleDragStart, handleDragOver} = useAppContext();

  return (
    <li
      key={item._id}
      className={`h-30 p-4 rounded-lg shadow-md flex flex-row justify-between items-center my-2 ${className}`}
      draggable
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e)}>
      {/* Player Name */}
      <div className="player-name font-semibold text-lg">{item.names}</div>

      {/* Tags List */}
      <TagsList item={item} />

      {/* Add to Shortest Queue Button */}
      {!item.assignedToQueue && (
        <Button
          onClick={onAddToQueue}
          className="px-2 py-1 rounded bg-tennis-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center">
          🔜 Shortest Queue
        </Button>
      )}
    </li>
  );
}
