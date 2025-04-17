// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function PlayerListItem({ item, zone }: { item: TPlayer; zone: string }) {
  const { tournamentOwner, currentTournament } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();
  const { handleDragStart, handleDragOver } = useDragNDrop();
  // const {handleAddToShortestQueue} = useAddToQueues();
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleDelete = () => {
    // console.log("emitting deletePlayer");
    if (socket) {
      socket.emit("deletePlayer", {
        playerToDelete: item,
        tournamentId: currentTournament,
      });
    }
  };

  const editAndDeleteStyles =
    "h-[40px] w-[42px] px-[2px] py-[2px] text-[1rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out flex items-center justify-center";

  return (
    <>
      {!editMode ? (
        <div
          className={`${tournamentOwner && "cursor-pointer"} h-auto w-full px-3 py-2 rounded-md shadow-left-bottom-lg flex flex-col justify-between items-center my-1`}
          draggable={`${!tournamentOwner ? false : true}`}
          onDragStart={() => handleDragStart(item)}
          onDragOver={(e) => handleDragOver(e)}
        >
          {/* Player Name */}
          <div className="w-full flex justify-between mb-2">
            <div className="player-name text-gray-500 font-bold text-sm w-[65%]">{item.names}</div>
            {!tournamentOwner ? null : (
              <Button
                onClick={() => {
                  // console.log("clicked the button to see the item ", item);
                  if (socket)
                    socket.emit("addPlayerToShortestQ", {
                      message: "emitting add to shortest",
                      playerData: item,
                      tournamentId: currentTournament?._id,
                    });
                  // NOTE: optimistic UI
                  // handleAddToShortestQueue(item);
                }}
                className="w-[45px] h-[45px] flex items-center justify-center text-[1rem] font-bold rounded text-shell-50 bg-bluestone-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
              >
                {/* ⬆️ Q */}
                {/* <FontAwesomeIcon icon={faArrowUp} /> */}
                {zone === "unprocessed" ? (
                  <FontAwesomeIcon icon={faArrowAltCircleRight} />
                ) : (
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                )}
              </Button>
            )}
          </div>

          <TagsList item={item} />

          <div className="w-full flex justify-between items-center">
            {!tournamentOwner ? null : (
              <div className="flex flex-row justify-between items-center h-full gap-1 mt-2">
                <Button className={editAndDeleteStyles} onClick={() => setEditMode(true)}>
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button className={editAndDeleteStyles} onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            )}
            <StarItem playerId={item._id} />
          </div>
        </div>
      ) : (
        <EditListItem item={item} setEditMode={setEditMode} />
      )}
    </>
  );
}
