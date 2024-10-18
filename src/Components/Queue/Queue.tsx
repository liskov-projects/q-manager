import Button from "@/Components/Button";
import QueueType from "@/types/Queue";
import useAddToQueues from "@/Hooks/useAddToQueues";
import PlayerItem from "../PlayerItem";

export default function Queue({
  queue,
  className,
  index
}: {
  queue: QueueType;
  className: string;
  index: number;
}) {
  const {handleProgressOneStep} = useAddToQueues();

  return (
    <div className={className}>
      <div className="flex flex-row justify-around">
        <h3 className="text-xl font-semibold text-purple-600 mb-4">
          Queue {queue.queueName}
        </h3>
      </div>

      {queue.queueItems.length > 0 && (
        <Button
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
          onClick={() => handleProgressOneStep(index)}>
          Progress Queue
        </Button>
      )}
      {queue.queueItems.length > 0 ? (
        <ul className="mb-4">
          {queue.queueItems.map((item, index) => (
            <PlayerItem
              key={item.id}
              className={` text-bear-50 ${
                index === 0 ? "bg-purple-200" : "bg-red-100"
              }  text-purple-800 p-2 rounded-lg mb-2`}
              item={item}
              // move these here from PlayerItem to declutter (double drag in (un)processed)
              // draggable
              // onDragStart={() => handleDragStart(item)}
              // onDragOver={e => handleDragOver(e, item)}
              // onDrop={e => handleDrop(e, item)}
            >
              {item.names}
            </PlayerItem>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-4">No items in queue</p>
      )}
    </div>
  );
}
