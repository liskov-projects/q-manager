import {useState} from "react";

export default function DropZone({
  // onDrop,
  index,
  height
}: {
  // onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  height: number;
}) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragEnter = () => setIsDraggedOver(true);
  const handleDragLeave = () => setIsDraggedOver(false);

  return (
    <div
      className="drop-zone transition-all duration-200 bg-gray-200 my-2 rounded"
      style={{
        height: isDraggedOver ? `${height}px` : "20px"
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={event => {
        setIsDraggedOver(false);
        // onDrop(event, index);
      }}
      onDragOver={event => event.preventDefault()}
    />
  );
}
