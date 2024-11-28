import useDragNDrop from "@/hooks/useDragNDrop";
import {TPlayer} from "@/types/Types";
import Button from "./Buttons/Button"; // Adjust the import if the button is in a different path
import TagsList from "./TagsList";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";

export default function PlayerListItem({
  item,
  className,
  onAddToQueue
}: {
  item: TPlayer;
  className: string;
  queueId?: string;
  onAddToQueue: () => void;
}) {
  const {tournamentOwner} = useTournamentsAndQueuesContext();

  const {handleDragStart, handleDragOver} = useDragNDrop();

  return (
    <li
      key={item._id}
      className={`h-30 p-4 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2 ${className}`}
      draggable={`${!tournamentOwner ? false : true}`}
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e)}>
      {/* Player Name */}
      <div className="player-name font-semibold text-lg">{item.names}</div>

      {/* Tags List */}
      <TagsList item={item} />

      {/* Add to Shortest Queue Button */}
      {!tournamentOwner ? null : (
        <Button
          onClick={onAddToQueue}
          className="px-10 py-7 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center">
          ADD TO SHORTEST QUEUE ⬆️
        </Button>
      )}
    </li>
  );
}
