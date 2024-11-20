// import Player from "@/types/Player";
// // import QueueType from "@/types/Queue";
// import React from "react";
// import {useQueuesContext} from "@/Context/AppContext";

// export default function QueueItem({
//   item,
//   className
// }: {
//   item: Player;
//   className: string;
// }) {
//   const {handleDragStart, handleDragOver} = useQueuesContext();
//   return (
//     <>
//       <li
//         className={className}
//         // for DRAGNDROP
//         draggable
//         onDragStart={() => handleDragStart(item)}
//         onDragOver={e => handleDragOver(e)}
//         {item.names}
//       </li>
//     </>
//   );
// }
