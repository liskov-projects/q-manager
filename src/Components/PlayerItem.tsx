import {useAppContext} from "@/Context/AppContext";
import {ReactNode} from "react";
import Player from "@/types/Player";
import ButtonUpDown from "./ButtonUpDown";

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
  const {handleDragStart, handleDragOver, handleDrop} = useAppContext();

  return (
    <div className="flex, flex-row">
      <div
        className={className}
        draggable
        onDragStart={() => handleDragStart(item)}
        onDragOver={e => handleDragOver(e)}
        onDrop={e => handleDrop(e, item)}>
        {children}
        {item.assignedToQueue && !item.processedThroughQueue && (
          // REVIEW:
          <ButtonUpDown item={item} queueId={queueId} />
        )}
      </div>
    </div>
  );
}
