// hooks
import { useState, useRef } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";

// types
import { TQueue } from "@/types/Types";
// components
import DropZone from "../DropZone";
import Button from "../Buttons/Button";
import QueueStatus from "./QueueStatus";
import QueuePositionLabel from "./QueuePositionLabel";
import ButtonExpand from "../Buttons/ButtonExpand";
import QueueListItem from "./QueueListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { TPlayer } from "@/types/Types.js";

export default function Queue({ queue, index }: { queue: TQueue; index: number }) {
  const { tournamentOwner, draggedItem, currentTournament } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();

  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [hoveredDropZoneIndex, setHoveredDropZoneIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const dragCounter = useRef(0);

  const handleDragEnter = (itemIndex: number) => {
    dragCounter.current++;
    setIsDraggedOver(true);
    setHoveredDropZoneIndex(itemIndex);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggedOver(false);
      setHoveredDropZoneIndex(null);
    }
  };

  return (
    <div
      className="rounded-lg shadow-left-bottom-lg p-2 flex flex-col border-3 border-grey-300 !overflow-visible"
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="flex flex-row justify-around items-center">
        <h3 className="text-xl font-semibold text-bluestone-200">Queue {queue.queueName}</h3>
        {!tournamentOwner ? null : (
          // FIXME: players into the unprocessed
          <Button
            className="mx-2 px-3 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out flex items-center justify-center"
            onClick={() => {
              console.log("current tournament after q is deleted", currentTournament);
              if (socket) {
                socket.emit("deleteQueue", {
                  tournamentId: currentTournament?._id,
                  queueToDelete: queue,
                });
              }
            }}
          >
            {/* 🗑️ */}
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        )}
      </div>
      {!tournamentOwner ? null : (
        <>
          <Button
            className={`my-2 py-2 text-[0.75rem] font-bold px-4 rounded transition-colors duration-200 
          ${
            queue.queueItems.length > 0
              ? "bg-bluestone-200 text-shell-50 hover:bg-tennis-50 hover:text-shell-300"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
            onClick={() => {
              if (socket) {
                socket.emit("processQueueOneStep", {
                  message: "emitting processQueueOneStep",
                  queueIndex: index,
                  tournamentId: currentTournament?._id,
                });
              }
              // optimistic UI
              // handleProgressOneStep(index);
            }}
            disabled={queue.queueItems.length === 0}
          >
            <div className="flex items-center justify-center gap-x-2">
              <span>PROGRESS QUEUE</span>
              {/* ⬆️ */}
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </div>
          </Button>
          <QueueStatus queue={queue} />
          <ButtonExpand isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
        </>
      )}

      {isExpanded && (
        <>
          <ul className="mb-4 h-[auto] overflow-visible">
            {queue.queueItems.map((item: TPlayer, itemIndex: number) => (
              <li
                key={item._id}
                className="flex flex-col items-center w-[100%]"
                onDragEnter={() => handleDragEnter(itemIndex)}
                onDragLeave={() => handleDragLeave()}
                onDrop={() => {
                  console.log("DROP IN FRONT END");
                  setIsDraggedOver(false);
                  socket?.emit("playerDropped", {
                    message: "playerDropped from DropZone",
                    draggedItem,
                    dropTarget: queue._id,
                    queue,
                    index: itemIndex,
                    tournamentId: currentTournament?._id,
                  });
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
              >
                <DropZone
                  hoveredDropZoneIndex={hoveredDropZoneIndex}
                  isDraggedOver={isDraggedOver}
                  index={itemIndex}
                />
                <QueuePositionLabel index={itemIndex} />
                <QueueListItem
                  item={item}
                  queueId={queue._id}
                  index={itemIndex} // Pass index to handle drop events
                />
              </li>
            ))}
            {/* NOTE: the last dropZone in the list? */}
            {queue.queueItems.length > 0 && (
              <li
                onDragEnter={() => handleDragEnter(0)}
                onDragLeave={() => handleDragLeave()}
                onDrop={() => {
                  console.log("DROP IN FRONT END");
                  setIsDraggedOver(false);
                  socket?.emit("playerDropped", {
                    message: "playerDropped from DropZone",
                    draggedItem,
                    dropTarget: queue._id,
                    queue,
                    index: -1,
                    tournamentId: currentTournament?._id,
                  });
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
              >
                <DropZone
                  hoveredDropZoneIndex={hoveredDropZoneIndex}
                  index={-1}
                  isDraggedOver={isDraggedOver}
                />
              </li>
            )}
          </ul>
          {/* // NOTE: empty queue zone */}
          {queue.queueItems.length === 0 && (
            <div
              onDragEnter={() => handleDragEnter(0)}
              onDragLeave={() => handleDragLeave()}
              onDrop={() => {
                console.log("DROP IN FRONT END");
                setIsDraggedOver(false);
                socket?.emit("playerDropped", {
                  message: "playerDropped from DropZone",
                  draggedItem,
                  dropTarget: queue._id,
                  queue,
                  index: queue.queueItems.length,
                  tournamentId: currentTournament?._id,
                });
              }}
              onDragOver={(event) => {
                event.preventDefault();
              }}
            >
              <DropZone
                hoveredDropZoneIndex={hoveredDropZoneIndex}
                index={0}
                isDraggedOver={isDraggedOver}
                inEmptyList={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
