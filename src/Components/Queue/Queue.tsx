import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {useState} from "react";
import DropZone from "../DropZone";
import useAddToQueues from "@/hooks/useAddToQueues";
import Button from "../Buttons/Button";
import QueueStatus from "./QueueStatus";
import QueuePositionLabel from "./QueuePositionLabel";
import {TQueue} from "@/types/Types";
import ButtonExpand from "../Buttons/ButtonExpand";
import QueueListItem from "./QueueListItem";
import useDragNDrop from "@/hooks/useDragNDrop";

export default function Queue({queue, index}: {queue: TQueue; index: number}) {
  const {handleProgressOneStep} = useAddToQueues();
  const {tournamentOwner} = useTournamentsAndQueuesContext();

  const {handleEmptyQueue, handleDrop} = useDragNDrop();
  // FIXME: false
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="rounded-lg shadow-left-bottom-lg p-2 flex flex-col border-3 border-grey-300"
      onDragOver={event => event.preventDefault()}>
      <div className="flex flex-row justify-around">
        <h3 className="text-xl font-semibold text-bluestone-200 mb-4">
          Queue {queue.queueName}
        </h3>
      </div>
      {!tournamentOwner ? null : (
        <>
          <Button
            className={`my-2 py-2 text-[0.75rem] font-bold px-4 rounded transition-colors duration-200 
          ${
            queue.queueItems.length > 0
              ? "bg-brick-200 text-shell-100 hover:bg-tennis-50 hover:text-shell-300"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
            onClick={() => handleProgressOneStep(index)}
            disabled={queue.queueItems.length === 0}>
            PROGRESS QUEUE ⬆️
          </Button>
          <QueueStatus queue={queue} />
          <ButtonExpand
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </>
      )}

      {isExpanded && (
        <>
          {queue.queueItems.length > 0 ? (
            <ul className="mb-4 h-[auto] overflow-hidden hover:overflow-y-auto">
              {queue.queueItems.map((item, index) => (
                <li key={item._id} className="flex flex-col items-center w-[100%]">
                  <QueuePositionLabel index={index} />
                  <QueueListItem
                    item={item}
                    className={
                      index === 0
                        ? "bg-green-600 text-shell-50 border-4 border-black"
                        : "bg-shell-100"
                    }
                    queueId={queue._id}
                    index={index} // Pass index to handle drop events
                  />
                  <DropZone
                    height={60}
                    index={index}
                    dropTarget={queue._id} // Pass queue as drop target
                    // onDrop={e => handleDrop({e, dropTarget: queue, index})}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <span>No items</span>
              <DropZone
                height={60}
                dropTarget={queue._id}
                // onDrop={e => handleEmptyQueue(e, queue)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
