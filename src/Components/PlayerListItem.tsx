// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useUser } from "@clerk/nextjs";
// import useAddToQueues from "@/hooks/useAddToQueues";
import useDragNDrop from "@/hooks/useDragNDrop";
import { useSocket } from "@/context/SocketContext";
// types
import { TPlayer } from "@/types/Types";
// components
import Button from "./Buttons/Button";
import TagsList from "./TagsList";
import EditListItem from "./EditListItem";
import StarItem from "./Buttons/StarItem";

export default function PlayerListItem({ item }: { item: TPlayer }) {
  const { tournamentOwner, currentTournament } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();
  const { handleDragStart, handleDragOver } = useDragNDrop();
  // const {handleAddToShortestQueue} = useAddToQueues();
  const [editMode, setEditMode] = useState(false);

  const { isSignedIn } = useUser();

  const handleDelete = () => {
    // console.log("emitting deletePlayer");
    if (socket) {
      socket.emit("deletePlayer", {
        playerToDelete: item,
        tournamentId: currentTournament,
      });
    }
  };

  return (
    <>
      {!editMode ? (
        <li
          // key={item._id}
          className="h-30 w-[92%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
          draggable={`${!tournamentOwner ? false : true}`}
          onDragStart={() => handleDragStart(item)}
          onDragOver={(e) => handleDragOver(e)}
        >
          {/* Player Name */}
          <div className="player-name font-semibold text-lg">
            {item.names}
            {!tournamentOwner ? null : (
              <div className="flex flex-row">
                <Button
                  className="mx-2 px-3 py-1 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
                  onClick={() => setEditMode(true)}
                >
                  ✏️
                </Button>
                <Button
                  className="mx-2 px-5 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
                  onClick={handleDelete}
                >
                  🗑️
                </Button>
              </div>
            )}
            {isSignedIn ? <StarItem playerId={item._id} /> : null}
          </div>

          <TagsList item={item} />

          {!tournamentOwner ? null : (
            <Button
              onClick={() => {
                console.log("clicked the button to see the item ", item);
                if (socket)
                  socket.emit("addPlayerToShortestQ", {
                    message: "emitting add to shortes",
                    playerData: item,
                    tournamentId: currentTournament?._id,
                  });
                // NOTE: optimistic UI
                // handleAddToShortestQueue(item);
              }}
              className="px-10 py-5 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
            >
              ⬆️ Q
            </Button>
          )}
        </li>
      ) : (
        <EditListItem item={item} setEditMode={setEditMode} />
      )}
    </>
  );
}
