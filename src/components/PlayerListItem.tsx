// hooks
import {useState} from "react";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import useAddToQueues from "@/hooks/useAddToQueues";
import useDragNDrop from "@/hooks/useDragNDrop";
// types
import {TPlayer} from "@/types/Types";
// components
import Button from "./Buttons/Button";
import TagsList from "./TagsList";
import EditListItem from "./EditListItem";

export default function PlayerListItem({item}: {item: TPlayer}) {
  const {tournamentOwner, setCurrentTournamentPlayers} =
    useTournamentsAndQueuesContext();
  const {handleAddToShortestQueue} = useAddToQueues();
  const {handleDragStart, handleDragOver} = useDragNDrop();
  const [editMode, setEditMode] = useState(false);

  // FIXME:
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/players/${item._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCurrentTournamentPlayers(current =>
          current.filter(el => el._id !== item._id)
        );
      }
    } catch (err) {
      return new Error("Error deleting a player", err);
    }
  };

  return (
    <>
      {!editMode ? (
        <li
          // key={item._id}
          className="h-30 w-[92%] p-4 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
          draggable={`${!tournamentOwner ? false : true}`}
          onDragStart={() => handleDragStart(item)}
          onDragOver={e => handleDragOver(e)}>
          {/* Player Name */}
          <div className="player-name font-semibold text-lg">
            {item.names}
            {!tournamentOwner ? null : (
              <div className="flex flex-row">
                <Button
                  className="mx-2 px-5 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
                  onClick={() => setEditMode(true)}>
                  ✏️
                </Button>
                <Button
                  className="mx-2 px-5 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
                  onClick={handleDelete}>
                  🗑️
                </Button>
              </div>
            )}
          </div>

          {/* Tags List */}
          <TagsList item={item} />

          {/* Add to Shortest Queue Button */}
          {!tournamentOwner ? null : (
            <Button
              onClick={() => handleAddToShortestQueue(item._id)}
              className="px-10 py-5 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center">
              ADD TO SHORTEST QUEUE ⬆️
            </Button>
          )}
        </li>
      ) : (
        <EditListItem item={item} setEditMode={setEditMode} />
      )}
    </>
  );
}
