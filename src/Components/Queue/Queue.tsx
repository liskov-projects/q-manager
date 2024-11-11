import {useState} from "react";
import DropZone from "../DropZone"; // Import the DropZone component
import useAddToQueues from "@/hooks/useAddToQueues";
import Button from "../Buttons/Button";
import QueueStatus from "./QueueStatus";
import QueuePositionLabel from "./QueuePositionLabel";

import ButtonExpand from "../Buttons/ButtonExpand";
import QueueListItem from "../QueueListItem";
import useDragNDrop from "@/hooks/useDragNDrop";

export default function Queue({queue, index}: {queue: QueueType; index: number}) {
  const {handleProgressOneStep} = useAddToQueues();
  const {handleEmptyQueue, handleDrop} = useDragNDrop();
  // FIXME: false
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="rounded-lg shadow-lg p-6 flex flex-col"
      onDragOver={event => event.preventDefault()}>
      <div className="flex flex-row justify-around">
        <h3 className="text-xl font-semibold text-bluestone-200 mb-4">
          Queue {queue.queueName}
        </h3>
      </div>
      <Button
        className={`my-2 py-2 px-4 rounded transition-colors duration-200 
          ${
            queue.queueItems.length > 0
              ? "bg-brick-200 text-shell-100 hover:bg-tennis-50 hover:text-shell-300"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        onClick={() => handleProgressOneStep(index)}
        disabled={queue.queueItems.length === 0}>
        Progress Queue
      </Button>
      <QueueStatus queue={queue} />
      <ButtonExpand
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <>
          {queue.queueItems.length > 0 ? (
            <ul className="mb-4 h-[60vh] overflow-hidden hover:overflow-y-auto">
              {queue.queueItems.map((item, index) => (
                <li key={item._id}>
                  <QueuePositionLabel index={index} />
                  <QueueListItem
                    item={item}
                    className={
                      index === 0 ? "bg-green-600 text-shell-50" : "bg-shell-100"
                    }
                    queueId={queue.id}
                    index={index} // Pass index to handle drop events
                  />
                  <DropZone
                    height={60}
                    index={index}
                    dropTarget={queue} // Pass queue as drop target
                    onDrop={event => handleDrop({event, dropTarget: queue, index})}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <span>No items</span>
              <DropZone height={60} onDrop={e => handleEmptyQueue(e, queue)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
