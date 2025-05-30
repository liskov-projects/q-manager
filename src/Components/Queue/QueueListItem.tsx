// hooks
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
// types
import { TPlayer } from "@/types/Types";
// components
import TagsList from "../TagsList";
import StarItem from "@/Components/Buttons/StarItem.tsx";
import { useState, useEffect } from "react";

export default function QueueListItem({
  item,
  className,
  index,
}: {
  item: TPlayer;
  className: string;
  queueId: string;
  index: number;
}) {
  const { handleDragStart, handleDragOver } = useDragNDrop();
  const { tournamentOwner, justDropped } = useTournamentsAndQueuesContext();

  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    if (justDropped?._id === item._id) {
      setShowGif(true);
      const durationOfOneLoop = 1000; // adjust based on gif duration (ms)
      const totalDuration = durationOfOneLoop * 3;

      const timer = setTimeout(() => {
        setShowGif(false);
      }, totalDuration);

      return () => clearTimeout(timer);
    }
  }, [justDropped, item._id]);

  if (item.isHidden) {
    return null;
  }
  // NOTE: star background?
  return (
    <div
      key={item._id}
      id={item._id}
      className={`z-100 overflow-hidden ${tournamentOwner && "cursor-pointer"}  ${index === 0 ? "bg-green-600 hover:bg-green-700 text-shell-50 border-4 border-black" : "border-[1px] border-gray-400 hover:bg-gray-200"} p-2 shadow-left-bottom-lg w-[95%] left-bottom-lg rounded-md text-sm font-bold mb-[3px] text-center ${className} ${justDropped?._id === item._id ? "animate-shake bg-yellow-200" : className}`}
      draggable={`${!tournamentOwner ? false : true}`}
      onDragStart={() => handleDragStart(item)}
      onDragOver={(e) => handleDragOver(e)}
    >
      <div className="flex justify-between">
        <div
          className={`mb-1 ${index === 0 ? "text-white tracking-wide [text-shadow:_-0.5px_0.5px_1px_black] font-extrabold" : "text-gray-500"} font-bold w-[70%] border-white`}
        >
          {item.names}
        </div>
        <StarItem playerId={item._id} />
      </div>
      <div className="flex justify-between">
        <TagsList item={item} />
        {index === 0 ? (
          <img
            src="/snoopy-tennis-funny.gif"
            alt="snoopy-tennis.gif"
            className="w-[20%] min-w-[75px] max-w-[100px] h-auto mx-1"
          />
        ) : null}
      </div>
    </div>
  );
}
