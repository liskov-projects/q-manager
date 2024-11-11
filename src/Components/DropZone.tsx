import QueueType from "@/types/Queue";
import {useState} from "react";

export default function DropZone({
  onDrop,
  index,
  queue,
  height
}: {
  onDrop: (
    event: React.DragEvent<HTMLDivElement>,
    queue?: QueueType,
    index?: number
  ) => void;
  index?: number;
  queue?: QueueType;
  dropTarget?: QueueType | string;
  height: number;
}) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragEnter = () => setIsDraggedOver(true);
  const handleDragLeave = () => setIsDraggedOver(false);

  return (
    <div
      className="drop-zone w-[100%] transition-all duration-200 bg-gray-200 my-2 rounded"
      style={{
        height: isDraggedOver ? `${height}px` : "20px",
        minHeight: "20px"
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={event => {
        setIsDraggedOver(false);
        onDrop(event, queue, index);
      }}
      onDragOver={event => event.preventDefault()}
    />
  );
}
