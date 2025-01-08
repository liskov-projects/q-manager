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
    dropTarget
  }: {
    e: React.MouseEvent<HTMLDivElement>;
    dropTarget: string | TQueue;
    index?: number;
  }) => {
    e.preventDefault();

    if (!draggedItem) return;

    // Update the item's properties based on the target drop zone
    const updatedItem = {...draggedItem};

    if (dropTarget === "processed") {
      setCurrentTournament(prev => {
        // has to have it as TS yell without
        if (!prev) return null;
        return {
          ...prev,
          unProcessedQItems: prev.unProcessedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          processedQItems: [...prev.processedQItems, updatedItem],
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
      setCurrentTournament(prev => {
        // has to have it as TS yell without
        if (!prev) return null;
        return {
          ...prev,
          processedQItems: prev.processedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          unProcessedQItems: [...prev.unProcessedQItems, updatedItem],
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
      setCurrentTournament(prev => {
        // has to have it as TS yell without
        if (!prev) return null;
        return {
          ...prev,
          unProcessedQItems: prev.unProcessedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          processedQItems: prev.processedQItems.filter(
            player => player._id !== draggedItem._id
          ),
          queues: prev.queues.map(queue => {
            if (queue.queueItems.some(player => player._id === draggedItem._id)) {
              return {
                ...queue,
                queueItems: queue.queueItems.filter(
                  player => player._id !== draggedItem._id
                )
              };
            }
            if (queue.id === dropTarget.id) {
              return {
                ...queue,
                queueItems: [...queue.queueItems, updatedItem]
              };
            }
            return queue;
          }),
          // has to have it as TS yell without
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
