import {useAppContext} from "@/Context/AppContext";
import Player from "@/types/Player";
import QueueType from "@/types/Queue"; // Import QueueType

const useDragNDrop = () => {
  const {players, queues, updatePlayers, updateQueues, draggedItem, setDraggedItem} =
    useAppContext();

  // Handle drag start
  const handleDragStart = (draggedItem: Player) => {
    setDraggedItem(draggedItem);
  };

  // Prevent default on drag over
  const handleDragOver = (e: React.MouseEvent<HTMLLIElement>): void =>
    e.preventDefault();

  // Identify the queue the dragged item is from
  // function identifyQueues(queues: QueueType[], draggedItem: Player) {
  //   if (draggedItem.assignedToQueue) {
  //     const sourceQueue = queues.find(queue =>
  //       queue.queueItems.some(item => item._id === draggedItem._id)
  //     );
  //     return sourceQueue ? sourceQueue.queueName : null;
  //   } else {
  //     console.log("Item is not in any queue");
  //   }
  // }

  // Handle dropping into an empty queue
  const handleEmptyQueue = (e, dropQueue: QueueType) => {
    e.preventDefault();

    if (!draggedItem) return;

    // Create a copy of the dragged item with updated properties
    const updatedItem = {
      ...draggedItem,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    const updatedPlayers = players.map(player =>
      player._id === draggedItem._id ? updatedItem : player
    );

    const updatedQueues = queues.map(queue => {
      if (queue.id === dropQueue.id) {
        // Add the updated item to the queue
        const newQueueItems = [...queue.queueItems, updatedItem];
        return {
          ...queue,
          queueItems: newQueueItems
        };
      }
      return queue;
    });

    updatePlayers(updatedPlayers);
    updateQueues(updatedQueues);
    setDraggedItem(null);
  };

  // General handle drop function for different drop targets
  const handleDrop = ({event, dropTarget, index}) => {
    event.preventDefault();

    if (!draggedItem) return;

    // Determine if the dragged item is already in a queue
    const isInQueue =
      draggedItem.assignedToQueue && !draggedItem.processedThroughQueue;

    // Update the item's properties based on the target drop zone
    let updatedItem = {...draggedItem};

    if (dropTarget === "processed") {
      updatedItem = {
        ...updatedItem,
        assignedToQueue: false,
        processedThroughQueue: true
      };
    } else if (dropTarget === "unprocessed") {
      updatedItem = {
        ...updatedItem,
        assignedToQueue: false,
        processedThroughQueue: false
      };
    } else if (typeof dropTarget === "object" && dropTarget.id) {
      // dropTarget is a queue
      updatedItem = {
        ...updatedItem,
        assignedToQueue: true,
        processedThroughQueue: false
      };
    }

    // Update players list based on the drop target
    let updatedPlayers;
    if (dropTarget === "processed" || dropTarget === "unprocessed") {
      // Remove the item from its current location and add to the specified list
      updatedPlayers = players.filter(player => player._id !== draggedItem._id);
      const insertIndex = index !== undefined ? index : updatedPlayers.length;
      updatedPlayers.splice(insertIndex, 0, updatedItem);
    } else {
      // If drop target is a queue, simply update the players list to reflect status
      updatedPlayers = players.map(player =>
        player._id === draggedItem._id ? updatedItem : player
      );
    }

    // Update queues if necessary
    const updatedQueues = queues.map(queue => {
      const isTargetQueue =
        typeof dropTarget === "object" && queue.id === dropTarget.id;

      // Remove the item from its current queue if necessary
      if (isInQueue && queue.queueItems.some(item => item._id === draggedItem._id)) {
        const filteredQueueItems = queue.queueItems.filter(
          item => item._id !== draggedItem._id
        );
        return {...queue, queueItems: filteredQueueItems};
      }

      // Add the item to the target queue at the specified index if dropping into a queue
      if (isTargetQueue) {
        const newQueueItems = [...queue.queueItems];
        newQueueItems.splice(index, 0, updatedItem);
        return {...queue, queueItems: newQueueItems};
      }

      return queue;
    });

    // Update state
    updatePlayers(updatedPlayers);
    updateQueues(updatedQueues);
    setDraggedItem(null);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleEmptyQueue,
    handleDrop,
    draggedItem
  };
};

export default useDragNDrop;

//
//   const dragNdropPlayers = (draggedItem, targetItem) => {
//     // Find the indexes of the dragged and target items in the Players []
//     const draggedItemIndex = players.findIndex(item => item._id === draggedItem._id);
//     const targetItemIndex = players.findIndex(item => item._id === targetItem._id);

//     // make a copy
//     const updatedPlayers = [...players];

//     // removes the dragged item (draggedItem - what to move, 1 - items to remove)
//     updatedPlayers.splice(draggedItemIndex, 1);

//     // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
//     updatedPlayers.splice(targetItemIndex, 0, draggedItem);

//     setPlayers(updatedPlayers);
//   };

// main dNd function

// const dragNdropInQueues = (draggedItem: Player, targetItem: Player) => {
//   console.log("dragNdropInQueues enters ");
//   // Find the queues containing dragged and target items
//   const draggedQueueIndex = queues.findIndex(q =>
//     q.queueItems.some(item => item._id === draggedItem._id)
//   );
//   const targetQueueIndex = queues.findIndex(q =>
//     q.queueItems.some(item => item._id === targetItem._id)
//   );

//   // check if the indexes are found
//   if (draggedQueueIndex === -1 || targetQueueIndex === -1) return;

//   // Find the indexes of the dragged and target items in queues
//   const draggedItemIndex = queues[draggedQueueIndex].queueItems.findIndex(
//     item => item._id === draggedItem._id
//   );
//   const targetItemIndex = queues[targetQueueIndex].queueItems.findIndex(
//     item => item._id === targetItem._id
//   );
// };
//     // Copy the queues
//     const updatedDraggedQueueItems = [...queues[draggedQueueIndex].queueItems];
//     const updatedTargetQueueItems = [...queues[targetQueueIndex].queueItems];

//     // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
//     updatedDraggedQueueItems.splice(draggedItemIndex, 1);
//     console.log("Dragging from", updatedDraggedQueueItems);
//     // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
//     updatedTargetQueueItems.splice(targetItemIndex, 0, draggedItem);

//     // Update the state with modified items
//     setQueues((prevQueues: QueueType[]) => {
//       return prevQueues.map((q, index) => {
//         if (index === draggedQueueIndex) {
//           return {...q, queueItems: updatedDraggedQueueItems};
//         }
//         if (index === targetQueueIndex) {
//           return {...q, queueItems: updatedTargetQueueItems};
//         }
//         return q;
//       });
//     });
//   };
