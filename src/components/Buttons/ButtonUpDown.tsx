// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
// import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
// import {useAppContext} from "@/Context/AppContext";
// import useAddToQueues from "@/hooks/useAddToQueues";
// import PlayerType from "@/types/Player";

// //REVIEW: why have to pass queueID? if taken out here doesn't change anything see PlayerItem
// export default function ButtonUpDown({item}: {item: PlayerType}) {
//   const {queues, setQueues, setPlayers} = useAppContext();
//   const {handleProgressOneStep} = useAddToQueues();

//   // console.log("ITEM: ", item);
//   // console.log("QUEUEID: ", queueId);
//   // console.log("ITEM.queueID: ", item.queueID);

//   const itemToMove = item.item;
//   const movingIn = item.queueId;

//   function handleUp(itemToMove, movingIn) {
//     const currentQueue = queues.find(queue => queue.id === movingIn);
//     if (!currentQueue) return;
//     // console.log("current queue ", currentQueue);

//     const queueToUpdate = [...currentQueue?.queueItems];
//     const itemToMoveIndex = queueToUpdate?.findIndex(
//       item => item._id === itemToMove._id
//     );
//     // console.log(itemToMoveIndex);

//     if (itemToMoveIndex === 0) {
//       const queueIndex = queues.findIndex(queue => queue.id === currentQueue?.id);

//       handleProgressOneStep(queueIndex);

//       setPlayers(prevPlayers => {
//         return prevPlayers.map(player => {
//           if (player._id === itemToMove._id) {
//             return {...player, assignedToQueue: false};
//           }
//           return player;
//         });
//       });
//     } else {
//       // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
//       queueToUpdate.splice(itemToMoveIndex, 1);
//       // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
//       queueToUpdate.splice(itemToMoveIndex - 1, 1, itemToMove);

//       setQueues(prevQueues => {
//         return prevQueues.map(q => {
//           if (q.id === movingIn) {
//             return {...q, queueItems: queueToUpdate};
//           } else {
//             return q;
//           }
//         });
//       });
//     }
//   }

//   const currentQueue = queues.find(queue => queue.id === movingIn);
//   const queueToUpdate: Player[] = [...currentQueue?.queueItems];
//   const itemToMoveIndex = queueToUpdate?.findIndex(
//     item => item._id === itemToMove.id
//   );

//   // TODO: debug why it's duplicated going down
//   function handleDown() {
//     if (!currentQueue) return;
//     // console.log("current queue ", currentQueue);
//     // NEW:
//     // console.log(itemToMoveIndex);

//     if (itemToMoveIndex >= 0 && itemToMoveIndex < queueToUpdate.length - 1) {
//       // sorting out why it all broke going down
//       const itemToMoveCopy = {...itemToMove};
//       // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
//       queueToUpdate.splice(itemToMoveIndex, 1);
//       // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
//       queueToUpdate.splice(itemToMoveIndex + 1, 0, itemToMoveCopy);
//     }

//     setQueues(prevQueues => {
//       return prevQueues.map(q => {
//         if (q.id === movingIn) {
//           return {...q, queueItems: queueToUpdate};
//         } else {
//           return q;
//         }
//       });
//     });
//   }

//   return (
//     <div className="flex flex-col">
//       <FontAwesomeIcon
//         icon={faCaretUp}
//         className={`cursor-pointer ${
//           itemToMoveIndex === 0
//             ? "bg-tennis-50 hover:bg-tennis-200"
//             : "bg-shell-100 hover:bg-tennis-50"
//         } transition-colors duration-200`}
//         onClick={() => handleUp(itemToMove, movingIn)}
//       />
//       <FontAwesomeIcon
//         icon={faCaretDown}
//         className={`cursor-pointer ${
//           itemToMoveIndex === 0
//             ? "bg-tennis-50 hover:bg-tennis-200"
//             : "bg-shell-100 hover:bg-tennis-50"
//         } transition-colors duration-200`}
//         onClick={() => handleDown()}
//       />
//     </div>
//   );
// }
