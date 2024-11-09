import {useAppContext} from "@/Context/AppContext";
// types
import Player from "@/types/Player";

const useDragNDrop = () => {
  const {players, queues, updatePlayers, updateQueues, draggedItem, setDraggedItem} =
    useAppContext();

  // D N D    x p e r i m e n t
  const handleDragStart = (draggedItem: Player) => {
    console.log("drag start & item is", draggedItem);
    setDraggedItem(draggedItem);
  };
  // type for the event object
  const handleDragOver = (e: React.MouseEvent<HTMLLIElement>): void =>
    e.preventDefault();

  //   find where we're dragging FROM
  function identifyQueues(queues, draggedItem) {
    // if dragged item assigned to a queue: true
    if (draggedItem.assignedToQueue) {
      const sourceQueue = queues.find(queue =>
        queue.queueItems.some(item => item._id === draggedItem._id)
      );
      // console.log("source queue name: ", sourceQueue);
      return sourceQueue.queueName;
    } else {
      console.log("no queues");
    }
  }

  const handleEmptyQueue = (e, dropQueue: QueueType) => {
    e.preventDefault();

    console.log("HANDLEDROPINTO Empty QUEUE");
    // console.log("DRAGGED ITEM");
    // console.log(draggedItem);
    // console.log("index: ", index);
    // console.log("DropQueue");
    // console.log(dropQueue);
    if (!draggedItem) return;

    // create a copy of the dragged item to correctly change the property
    const updatedItem = {
      ...draggedItem,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    const updatedPlayers = players.map(player => {
      if (player._id === draggedItem._id) {
        return updatedItem;
      }
      return player;
    });

    const updatedQueues = queues.map(queue => {
      if (queue.id === dropQueue.id) {
        console.log("entering the updater");
        // Create a new array with the updatedItem inserted at the specified index
        const newQueueItems = [...queue.queueItems, updatedItem];
        // Return a new queue object with the updated queueItems
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

  const handleDropIntoQueue = (
    e,
    dropQueue: QueueType,
    index: number = 0
    // queues
  ) => {
    e.preventDefault();

    console.log("HANDLEDROPINQUEUES");

    // console.log("DRAGGED ITEM");
    // console.log(draggedItem);

    console.log("index: ", index);
    // console.log("DropQueue");
    // console.log(dropQueue);
    if (!draggedItem) return;

    // const sourceQueueName = identifyQueues(queues, draggedItem);

    // create a copy of the dragged item to correctly change the property
    const updatedItem = {
      ...draggedItem,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    const updatedPlayers = players.map(player => {
      if (player._id === draggedItem._id) {
        return updatedItem;
        // return {...player, assignedToQueue: true};
      }
      return player;
    });

    const updatedQueues = queues.map(queue => {
      if (queue.id === dropQueue.id) {
        console.log("entering the updater");
        // Create a new array with the draggedItem inserted at the specified index
        const newQueueItems = [
          ...queue.queueItems.slice(0, index),
          updatedItem,
          ...queue.queueItems.slice(index)
        ];
        // Return a new queue object with the updated queueItems
        return {
          ...queue,
          queueItems: newQueueItems
        };
      }
      //   else if (queue.queueName === sourceQueueName) {
      //     return {
      //       ...queue,
      //       queueItems: queue.queueItems.filter(item => item._id !== draggedItem._id)
      //     };
      //   }
      return queue;
    });

    updatePlayers(updatedPlayers);
    updateQueues(updatedQueues);
    // console.log("DRAGGED ITEM AFTER DROP");
    // console.log(updatedItem);
    setDraggedItem(null);
  };
  return {
    handleDragStart,
    handleDragOver,
    handleDropIntoQueue,
    handleEmptyQueue,
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
