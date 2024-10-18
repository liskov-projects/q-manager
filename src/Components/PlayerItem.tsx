import {useAppContext} from "@/Context/AppContext";
import {ReactNode} from "react";
import Player from "@/types/Player";

export default function PlayerItem({
  item,
  className,
  children
}: {
  item: Player;
  className: string;
  children: ReactNode;
}) {
  const {handleDragStart, handleDragOver, handleDrop} = useAppContext();

  return (
    <li
      className={className}
      draggable
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e)}
      onDrop={e => handleDrop(e, item)}>
      {children}
    </li>
  );
}
