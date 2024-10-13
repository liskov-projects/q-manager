import Player from "@/types/Player";
import QueueType from "@/types/Queue";
import React from "react";

export default function QueueItem({
  item,
  className,
  onDragStart,
  onDragOver,
  onDrop
}: {
  item: Player;
  className: string;
  onDragStart: (item: Player) => Player;
  onDragOver: (e: React.MouseEvent<HTMLButtonElement>, item: Player) => void;
  onDrop: (e: React.MouseEvent<HTMLButtonElement>, item: Player) => QueueType[];
}) {
  return (
    <li
      className={className}
      // for DRAGNDROP
      draggable
      onDragStart={() => onDragStart(item)}
      onDragOver={e => onDragOver(e, item)}
      onDrop={e => onDrop(e, item)}>
      {item.names}
    </li>
  );
}
