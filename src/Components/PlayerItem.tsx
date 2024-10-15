import {useAppContext} from "@/Context/AppContext";

export default function PlayerItem({item, className, children}) {
  const {handleDragStart, handleDragOver, handleDrop} = useAppContext();

  return (
    <li
      className={children}
      draggable
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e, item)}
      onDrop={e => handleDrop(e, item)}>
      {children}
    </li>
  );
}
