"use client";

import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {TPlayer} from "@/types/Types";
import {TQueue} from "@/types/Types"; // Import TQueue
import React from "react";

const useDragNDrop = () => {
  const {
    currentTournamentPlayers,
    setCurrentTournamentPlayers,
    currentTournament,
    setCurrentTournament,
    draggedItem,
    setDraggedItem
  } = useTournamentsAndQueuesContext();

  // Handle drag start
  const handleDragStart = (draggedItem: TPlayer) => {
    setDraggedItem(draggedItem);
  };

  // Prevent default on drag over
  const handleDragOver = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLLIElement>
  ): void => e.preventDefault();

  // Handle dropping into an empty queue
  const handleEmptyQueue = (
    e: React.MouseEvent<HTMLDivElement>,
    dropQueue: TQueue
  ) => {
    e.preventDefault();

    if (!draggedItem) return;

    // Create a copy of the dragged item with updated properties
    const updatedItem = {
      ...draggedItem,
      assignedToQueue: true,
      processedThroughQueue: false
    };

    const updatedPlayers = currentTournamentPlayers.map((player: TPlayer) =>
      player._id === draggedItem._id ? updatedItem : player
    );

    const updatedQueues = currentTournament.queues.map((queue: TQueue) => {
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

    setCurrentTournamentPlayers(updatedPlayers);
    setCurrentTournament(prev => ({
      ...prev,
      queues: updatedQueues
    }));
    setDraggedItem(null);
  };

  // General handle drop function for different drop targets
  const handleDrop = ({
    e,
    dropTarget,
    index
  }: {
    e: React.MouseEvent<HTMLDivElement>;
    dropTarget: string | TQueue;
    index?: number;
  }) => {
    e.preventDefault();

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
      updatedPlayers = currentTournamentPlayers.filter(
        (player: TPlayer) => player._id !== draggedItem._id
      );
      const insertIndex = index !== undefined ? index : updatedPlayers.length;
      updatedPlayers.splice(insertIndex, 0, updatedItem);
    } else {
      // If drop target is a queue, simply update the players list to reflect status
      updatedPlayers = currentTournamentPlayers.map((player: TPlayer) =>
        player._id === draggedItem._id ? updatedItem : player
      );
    }

    // Update queues if necessary
    const updatedQueues = currentTournament.queues.map((queue: TQueue) => {
      const isTargetQueue =
        typeof dropTarget === "object" && queue.id === dropTarget.id;

      // Remove the item from its current queue if necessary
      if (
        isInQueue &&
        queue.queueItems.some((item: TPlayer) => item._id === draggedItem._id)
      ) {
        const filteredQueueItems = queue.queueItems.filter(
          item => item._id !== draggedItem._id
        );
        return {...queue, queueItems: filteredQueueItems};
      }

      // Add the item to the target queue at the specified index if dropping into a queue
      if (isTargetQueue) {
        const newQueueItems = [...queue.queueItems];
        newQueueItems.splice(index! + 1, 0, updatedItem);
        return {...queue, queueItems: newQueueItems};
      }

      return queue;
    });

    // Update state
    setCurrentTournamentPlayers(updatedPlayers);
    setCurrentTournament(prev => ({
      ...prev,
      queues: updatedQueues
    }));
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
//     setQueues((prevQueues: TQueue[]) => {
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
