// context
import {useAppContext} from "@/Context/AppContext";
//
import {useState} from "react";
//types
import Player from "@/types/Player";
//components
import Button from "@/Components/Button";
import QueueItem from "./QueueItem";
import QueueType from "@/types/Queue";
import useAddToQueues from "@/Hooks/useAddToQueues";

export default function Queue({
  queue,
  className,
  index
}: {
  queue: QueueType;
  // because we use a callback in setQueues
  setQueues: React.Dispatch<React.SetStateAction<QueueType[]>>;
  className: string;
  onProgress: (index: number) => QueueType[];
  index: number;
}) {
  const {setQueues} = useAppContext();
  const {handleProgressOneStep} = useAddToQueues();

  // TODO: drag and drop will be context
  const [draggedItem, setDraggedItem] = useState<Player | null>(null);
  const handleDragStart = (draggedItem: Player) => setDraggedItem(draggedItem);
  // type for the event object
  const handleDragOver = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  // does the main dragndrop
  const handleDrop = (e: React.MouseEvent<HTMLButtonElement>, targetItem: Player) => {
    // NOTE: S T A R T

    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = queue.queueItems.findIndex(
      item => item.id === draggedItem.id
    );
    const targetIndex = queue.queueItems.findIndex(item => item.id === targetItem.id);

    const updatedOrder = [...queue.queueItems];
    // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
    updatedOrder.splice(draggedIndex, 1); //this removes the item and places it where we want
    // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
    updatedOrder.splice(targetIndex, 0, draggedItem);

    setQueues((prevQueues: QueueType[]) => {
      return prevQueues.map((q: QueueType) => {
        if (q.id === queue.id) {
          q.queueItems = updatedOrder;
        }
        return q;
      });
    });

    setDraggedItem(null);
  };

  return (
    <div className={className}>
      <div className="flex flex-row justify-around">
        <h3 className="text-xl font-semibold text-purple-600 mb-4">
          Queue {queue.queueName}
        </h3>
      </div>
      {/* Progress Button */}
      {queue.queueItems.length > 0 && (
        <Button
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-200"
          onClick={() => handleProgressOneStep(index)}>
          Progress Queue
        </Button>
      )}
      {queue.queueItems.length > 0 ? (
        <ul className="mb-4">
          {/* REVIEW: item should be a player */}
          {queue.queueItems.map((item, index) => (
            <QueueItem
              key={item.id}
              className={`${
                index === 0 ? "bg-purple-200" : "bg-red-100"
              }  text-purple-800 p-2 rounded-lg mb-2`}
              item={item}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-4">No items in queue</p>
      )}
    </div>
  );
}
