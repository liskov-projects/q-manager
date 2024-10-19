import Button from "@/Components/Buttons/Button";
import QueueType from "@/types/Queue";
import useAddToQueues from "@/Hooks/useAddToQueues";
import PlayerItem from "../PlayerItem";

export default function Queue({queue, index}: {queue: QueueType; index: number}) {
  const {handleProgressOneStep} = useAddToQueues();

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
          onClick={() => handleProgressOneStep(index)}>
          Progress Queue
        </Button>
      )}
      {queue.queueItems.length > 0 ? (
        <ul className="mb-4">
          {queue.queueItems.map(
            (item, index) =>
              item.assignedToQueue && (
                <PlayerItem
                  key={item.id}
                  className={`${
                    index === 0 ? "bg-tennis-200" : "bg-shell-100"
                  }  text-shell-200 p-2 rounded-lg mb-2 text-center`}
                  // are passed down to ButtonUpDown
                  item={item}
                  queueId={queue.id}
                  // move these here from PlayerItem to declutter (double drag in (un)processed)
                  // draggable
                  // onDragStart={() => handleDragStart(item)}
                  // onDragOver={e => handleDragOver(e, item)}
                  // onDrop={e => handleDrop(e, item)}
                >
                  {item.names}
                </PlayerItem>
              )
          )}
        </ul>
      ) : (
        <p className="mb-4 text-center">No items in queue</p>
      )}
    </div>
  );
}
