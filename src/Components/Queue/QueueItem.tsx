export default function QueueItem({
  item,
  className,
  onDragStart,
  onDragOver,
  onDrop
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
