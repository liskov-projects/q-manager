import {useState} from "react";
import DropZone from "../DropZone"; // Import the DropZone component
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/hooks/useAddToQueues";
import Button from "../Buttons/Button";

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
      {queue.queueItems.length > 0 && (
        <Button
          className="my-2 py-2 px-4 rounded bg-brick-200 text-shell-100 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200"
          onClick={() => handleProgressOneStep(index)}>
          Progress Queue
        </Button>
      )}
      <div
        className={`flex self-center ${
          queue.queueItems.length < 4 ? "text-brick-300" : "text-bluestone-200"
        } font-bold text-3xl`}>
        {queue.queueItems.length || "No items"}
      </div>
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
                  <QueueListItem
                    item={item}
                    className={index === 0 ? "bg-tennis-200" : "bg-shell-100"}
                    queueId={queue.id}
                    index={index} // Pass index to handle drop events
                  />
                  <DropZone
                    height={60}
                    index={index}
                    dropTarget={queue} // Pass queue as drop target
                    onDrop={(event) => handleDrop({ event, dropTarget: queue, index })}
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
