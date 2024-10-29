import DropZone from "../DropZone"; // Import the DropZone component
import { useAppContext } from "@/Context/AppContext";
import Button from "../Buttons/Button";
import PlayerItem from "../PlayerItem";
import Player from "@/types/Player";

export default function Queue({
  queue,
  index,
}: {
  queue: QueueType;
  index: number;
}) {
  // const { handleProgressOneStep } = useAddToQueues();
  const { handleDrop, draggedItem } = useAppContext();

  const handleDropEvent = (
    event: React.DragEvent<HTMLUListElement>,
    queueId: string,
    index: number
  ) => {
    event.preventDefault();

    console.log("QUEUE ID")
    console.log(queueId)
    console.log("INDEX")
    console.log(index)


    handleDrop(index, queue);
  };

  return (
    <div className="rounded-lg shadow-lg p-6 flex flex-col justify-between">
      <div className="flex flex-row justify-around">
        <h3 className="text-xl font-semibold text-bluestone-200 mb-4">
          Queue {queue.queueName}
        </h3>
      </div>

      {queue.queueItems.length > 0 && (
        <Button
          className="my-2 py-2 px-4 rounded bg-tennis-200 hover:bg-tennis-50 transition-colors duration-200"
          onClick={() => handleProgressOneStep(index)}
        >
          Progress Queue
        </Button>
      )}
      {queue.queueItems.length > 0 ? (
        <ul
          className="mb-4"
          onDragOver={(event) => event.preventDefault()}
        >
          {queue.queueItems.map((item, index) => (
            <div 
              key={item._id}
              id={item._id}
              onDrop={(e) => handleDropEvent(e, queue.id, index)}
            >
              <PlayerItem
                data-target={item._id}
                className={`${
                  index === 0 ? "bg-tennis-200" : "bg-shell-100"
                } text-shell-200 p-2 rounded-lg mb-2 text-center`}
                item={item}
                queueId={queue.id}
              >
                {item.names}
              </PlayerItem>
              <DropZone
                // onDrop={(event) => handleDropEvent(event, queue)}
                height={60} // Set height matching PlayerItem when expanded
              />
            </div>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-center">No items in queue</p>
      )}
    </div>
  );
}
