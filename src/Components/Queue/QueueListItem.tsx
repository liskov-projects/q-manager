// hooks
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useUser } from "@clerk/nextjs";
import useDragNDrop from "@/hooks/useDragNDrop";
// types
import { TPlayer } from "@/types/Types";
// components
import TagsList from "../TagsList";
import StarItem from "@/Components/Buttons/StarItem";
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
  const { isSignedIn } = useUser();

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

  // NOTE: star background?
  return (
    <div
      key={item._id}
      id={item._id}
      className={`cursor-pointer p-2 shadow-left-bottom-lg w-[95%] left-bottom-lg rounded-lg mb-2 text-center ${className} ${justDropped?._id === item._id ? "animate-shake bg-yellow-200" : className}`}
      draggable={`${!tournamentOwner ? false : true}`}
      onDragStart={() => handleDragStart(item)}
      onDragOver={(e) => handleDragOver(e)}
    >
      <div className="flex">
        <div className="player-name font-bold w-[70%]">{item.names}</div>
        {isSignedIn ? <StarItem playerId={item._id} /> : null}
      </div>
      <div className="flex justify-between">
        <TagsList item={item} />
        {index === 0 ? (
          <img
            src="/snoopy-tennis-funny.gif"
            alt="snoopy-tennis.gif"
            className="w-16 h-12 inline-block ml-2 align-middle"
          />
        ) : null}
      </div>
    </div>
  );
}
