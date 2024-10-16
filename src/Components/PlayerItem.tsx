import {useAppContext} from "@/Context/AppContext";

export default function PlayerItem({item, className, children, ...rest}) {
  const {handleDragStart, handleDragOver, handleDrop} = useAppContext();

  return (
    <li
      className={className}
      draggable
      onDragStart={() => handleDragStart(item)}
      onDragOver={e => handleDragOver(e, item)}
      onDrop={e => handleDrop(e, item)}>
      {children}
    </li>
  );
}
