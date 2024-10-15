import Player from "@/types/Player";
// import QueueType from "@/types/Queue";
import React from "react";
import {useAppContext} from "@/Context/AppContext";
export default function QueueItem({
  item,
  className,
  children
}: // onDragStart,
// onDragOver,
// onDrop
{
  item: Player;
  className: string;
  // onDragStart: (item: Player) => Player;
  // onDragOver: (e: React.MouseEvent<HTMLButtonElement>, item: Player) => void;
  // onDrop: (e: React.MouseEvent<HTMLButtonElement>, item: Player) => QueueType[];
}) {
  const {handleDragStart, handleDragOver, handleDrop} = useAppContext();
  return (
    <li
      className={className}
      // for DRAGNDROP
      draggable
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e, item)}
      onDrop={e => handleDrop(e, item)}>
      {item.names}
    </li>
  );
}
