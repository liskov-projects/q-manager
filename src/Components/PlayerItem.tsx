import {useAppContext} from "@/Context/AppContext";
import {ReactNode} from "react";
import Player from "@/types/Player";
import ButtonUpDown from "./Buttons/ButtonUpDown";
import TagsList from "./TagsList";

export default function PlayerItem({
  item,
  className,
  children,
  queueId
}: {
  item: Player;
  className: string;
  children: ReactNode;
  queueId: string;
}) {
  const {handleDragStart, handleDragOver} = useAppContext();

  // console.log("queueID in playerItem: ", queueId);
  // console.log("item in playerItem: ", item);
  return (
    <div className="flex flex-row">
      <div
        className={className}
        draggable
        onDragStart={() => handleDragStart(item)}
        onDragOver={e => handleDragOver(e)}>
        {children}
        {item.assignedToQueue && !item.processedThroughQueue && (
          // REVIEW:
          <ButtonUpDown item={item} queueId={queueId} />
        )}
        <TagsList item={item} />
      </div>
    </div>
  );
}
