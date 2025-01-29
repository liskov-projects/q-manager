"use client";

import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {TPlayer} from "@/types/Types";
import {TQueue} from "@/types/Types"; // Import TQueue
import React from "react";

const useDragNDrop = () => {
  const {setCurrentTournament, draggedItem, setDraggedItem} =
    useTournamentsAndQueuesContext();

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

    const updatedItem = {...draggedItem};

    setCurrentTournament(prev => {
      // FIXME:
      return {
        ...prev,
        unProcessedQItems: prev.unProcessedQItems.filter(
          player => player._id !== draggedItem._id
        ),
        processedQItems: prev.processedQItems.filter(
          player => player._id !== draggedItem._id
        ),
        queues: prev.queues.map(queue =>
          queue.id === dropQueue.id
            ? {...queue, queueItems: [...queue.queueItems, updatedItem]}
            : queue
        )
      };
    });

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
    index?: number; // FIXME: handleSplice that takes the ind and the queue => does the splice for the queue
  }) => {
    e.preventDefault();

    if (!draggedItem) return;

    // Update the item's properties based on the target drop zone
    // const updatedItem = {...draggedItem};

    if (dropTarget === "processed") {
      console.log("dropping inside processed");
      setCurrentTournament(prev => {
        // has to have it as TS yell without
        if (!prev) return null;
        return {
          ...prev,
          unProcessedQItems: prev.unProcessedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          processedQItems: [...prev.processedQItems, draggedItem],
          queues: prev.queues.map(queue => ({
            ...queue,
            queueItems: queue.queueItems.filter(
              player => player._id !== draggedItem._id
            )
          })),
          // has to have it as TS yell without
          name: prev.name,
          adminUser: prev.adminUser,
          description: prev.description,
          categories: prev.categories || []
        };
      });
    } else if (dropTarget === "unprocessed") {
      console.log("dropping inside unprocessed");
      setCurrentTournament(prev => {
        // has to have it as TS yell without
        if (!prev) return null;
        return {
          ...prev,
          processedQItems: prev.processedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          unProcessedQItems: [...prev.unProcessedQItems, draggedItem],
          queues: prev.queues.map(queue => ({
            ...queue,
            queueItems: queue.queueItems.filter(
              player => player._id !== draggedItem._id
            )
          })),
          // has to have it as TS yell without
          name: prev.name,
          adminUser: prev.adminUser,
          description: prev.description,
          categories: prev.categories || []
        };
      });
    } else if (typeof dropTarget === "object" && dropTarget.id) {
      // comes through
      // console.log("dropping inside a queue");
      console.log("DRAGGED ITEM:", draggedItem);
      console.log("drop  target", dropTarget);
      // console.log("index", index);
      setCurrentTournament(prev => {
        // has to have it as TS yell without
        if (!prev) return null;

        let currentQueueId;
        // find which queue we're currently in
        prev.queues.find(queue => {
          if (queue.queueItems.some(player => player._id === draggedItem._id)) {
            currentQueueId = queue.id;
          }
        });
        const isSameQueue = currentQueueId === dropTarget.id;
        // takes out the item from the source queue
        const updatedQueues = prev.queues.map(queue => ({
          ...queue,
          queueItems: queue.queueItems.filter(player => player._id != draggedItem._id)
        }));

        if (isSameQueue) {
          const targetQueue = updatedQueues.find(q => q.id === dropTarget.id);
          if (targetQueue) {
            targetQueue.queueItems.splice(index + 1, 0, draggedItem);
          }
        } else {
          updatedQueues.forEach(queue => {
            if (queue.id === dropTarget.id) {
              queue.queueItems.splice(index + 1, 0, draggedItem);
            }
          });
        }
        return {
          ...prev,
          // takes the item out of the initial arr
          unProcessedQItems: prev.unProcessedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          // takes the item out of the arr
          processedQItems: prev.processedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          queues: updatedQueues,
          // has to have this, TS yells without
          name: prev.name,
          adminUser: prev.adminUser,
          description: prev.description,
          categories: prev.categories || []
        };
      });
    }
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
