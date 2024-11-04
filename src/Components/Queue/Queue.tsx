import {useState} from "react";
import DropZone from "../DropZone"; // Import the DropZone component
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";
import Button from "../Buttons/Button";
import PlayerItem from "../PlayerItem";
// import Player from "@/types/Player";
// NEW:
import ButtonExpand from "../Buttons/ButtonExpand";

export default function Queue({queue, index}: {queue: QueueType; index: number}) {
  const {handleProgressOneStep} = useAddToQueues();
  const {handleDrop, draggedItem, queues} = useAppContext();
  // FIXME: false
  const [isExpanded, setIsExpanded] = useState(true);

  // REVIEW: do we still need this?
  const handleDropEvent = (
    event: React.DragEvent<HTMLUListElement>,
    queueId: string,
    index: number,
    queues
  ) => {
    event.preventDefault();

    // console.log("QUEUE ID");
    // console.log(queueId);
    // console.log("INDEX");
    // console.log(index);

    //NEW:
    handleDrop(index, queue, queues);
  };

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
          className="my-2 py-2 px-4 rounded bg-tennis-200 hover:bg-tennis-50 transition-colors duration-200"
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
                <div
                  key={item._id}
                  id={item._id}
                  onDrop={e => handleDropEvent(e, queue.id, index, queues)}>
                  <PlayerItem
                    data-target={item._id}
                    className={`${
                      index === 0 ? "bg-tennis-200" : "bg-shell-100"
                    } text-shell-200 p-2 rounded-lg mb-2 text-center`}
                    item={item}
                    queueId={queue.id}>
                    {item.names}
                  </PlayerItem>
                  <DropZone height={60} />
                </div>
              ))}
            </ul>
          ) : (
            // REVIEW: undefined works | the underscore doesn't seem to be read as a placeholder
            <div onDrop={e => handleDropEvent(e, queue.id, undefined, queues)}>
              <span>No items</span>
              <DropZone height={60} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
