// import Player from "@/types/Player";
// // import TQueue from "@/types/Queue";
// import React from "react";
// import {useTournamentsAndQueuesContext} from "@/Context/AppContext";

// export default function QueueItem({
//   item,
//   className
// }: {
//   item: Player;
//   className: string;
// }) {
//   const {handleDragStart, handleDragOver} = useTournamentsAndQueuesContext();
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
