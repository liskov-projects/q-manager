import {useEffect, useState} from "react";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
import {TPlayer} from "@/types/Types";
import Button from "./Buttons/Button"; // Adjust the import if the button is in a different path
import TagsList from "./TagsList";
import EditListItem from "./EditListItem";
// import Modal from "./drafts/Modal";

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
  // NEW:
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      {!editMode ? (
        <li
          key={item._id}
          className={`h-30 p-4 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2  ${className}`}
          // className={className}
          draggable={`${!tournamentOwner ? false : true}`}
          onDragStart={() => handleDragStart(item)}
          onDragOver={e => handleDragOver(e)}>
          {/* Player Name */}
          <div className="player-name font-semibold text-lg">
            {item.names}
            {/* NEW: */}
            {!tournamentOwner ? null : (
              <Button
                className="px-5 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
                onClick={() => setEditMode(true)}>
                ✏️
              </Button>
            )}
          </div>

          {/* Tags List */}
          <TagsList item={item} />

          {/* Add to Shortest Queue Button */}
          {!tournamentOwner ? null : (
            <Button
              onClick={onAddToQueue}
              className="px-10 py-5 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center">
              ADD TO SHORTEST QUEUE ⬆️
            </Button>
          )}
        </li>
      ) : (
        <EditListItem item={item} setEditMode={setEditMode} />
      )}
      {/* TODO:
      1. oclick the card changes to controlled input
      2. create another component similar to the NewPlayerForm
      3. use it for controlled input instead of the modal
      4. Build api route for PUT
       */}
    </>
  );
}
